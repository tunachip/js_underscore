/*====================================
	engine/combat.js
	
	
	
	==================================== */
import { Element, Status, Zone, MoveType, MoveSpeed, Entity } from `./enums.js`;
import { DamageRules } from `./rules.js`;


class Combat
{
	constructor(player, encounter, rng_seed = 0) {
		const stat_caps = [3, 3, 1000, 5, 5, 3, 3, 3, 3, 3, 3, 3]
		
		// Init Combat Metadata
		this.rng_seed = rng_seed;
		this.dmg_rules = DamageRules;
		this.gameover = false;
		this.turn = 0;
		
		// Init Entity State Vectors
		const entities = (player, encounter);
		const n_ent = entities.length
		this.elite							= [];
		this.hp									= [];
		this.max_hp							= [];
		this.energy							= [];
		this.max_energy					= [];
		this.alive							= [true]					* n_ent;
		this.speed							= [0]							* n_ent;
		this.curse_chance				= [0]							* n_ent;
		this.attuned_to					= [[false] * 7]		* n_ent;
		this.has_status					= [[false] * 12]	* n_ent;
		this.turns_attuned			= [[0] * 7]				* n_ent;
		this.status_turns_left	= [[0] * 12]			* n_ent;
		self.status_turns_cap		= [stat_caps]			* n_ent;
		this.turns_skipped			= [0]							* n_ent;
		this.move_choice				= [-1]						* n_ent;
		this.entity_moves				= [[] * n_ent];

		// Init Move State Vectors
		this.move_template_id		= [];
		this.move_modifier_id		= [];
		this.move_name					= [];
		this.move_owner					= [];
		this.move_zone					= [];
		this.move_type					= [];
		this.move_element				= [];
		this.move_speed					= [];
		this.move_private				= [];
		this.move_ignores				= [];
		this.move_cooldown			= [];
		this.move_bound					= [];
		this.move_times					= [];
		this.move_ops						= [];

		// Init Listener State Vectors
		this.listeners					= [];
		this.listener_name			= [];
		this.listener_owner			= [];
		
		// Fill Out Vectors
		this.init_entities(entities);
		this.init_moves(entities);
		this.init_listeners(entities);
	}

	init_entities(this, entities) {	
		// Fills out Vectors for all entities	
		for (let i=0; i < entities.length; i++) {
			
			// Load Profile for Entity
			p	= entities[i];
			
			// Fill out data from Profile
			this.elite[i]							= p.elite;
			this.hp[i]								= p.hp;
			this.max_hp[i]						= p.max_hp;
			this.energy[i]						= p.energy;
			this.max_energy[i]				= p.max_energy;
			this.speed[i]							= p.speed;
		}
	
	// Set 'FirstPlayer' via Rand
		
		// Elites: Always 1 on 1, Always Go Last
		if (this.elite[1]) {
			this.speed = [1]
			this.speed.append([0] * (entities.length - 1))
		}
		else {
			this.speed[Math.floor(Math.random() * entities.length)] = 1;
		}
	}

	init_moves(this, entities) {
		// World Vector Idx
		let i = 0
		
		for (let e=0; e < entities.length; e++) {
			const moves = entities[i].moves
			
			for (let m=0; m < moves.length; m++) {
				// Build Move from Template + Modifier
				const move_data	= entities[e].move_data[m];
				const template_id = move_data['template_id'];
				const modifier_id = move_data['modifier_id'];
			  const move		 = load_move_from_template(template_id);
				const modifier = load_modifier_from_template(modifier_id);
				const merged	 = merge_move_metadata(move, modifier);

				this.move_template_id[i]	= template_id;
				this.move_modifier_id[i]	= modifier_id;
				this.move_owner[i]				= e;
				this.move_name[i]					= template_id;
				this.move_zone[i]					= move_data.zone;
				this.move_type[i]					= merged['type'];
				this.move_element[i]			= merged['element'];
				this.move_speed[i]				= merged['speed'];
				this.move_private[i]			= true;
				this.move_ignores[i]			= merged['ignores'];
				this.move_cooldown[i]			= 0;
				this.move_bound[i]				= false;
				this.move_times[i]				= merged['times'];
				this.move_ops[i]					= build_move_ops(move_template, mod_template);
				// Append to Owner as Reference
				this.entity_moves[e].append(i);
				// Adjust MetaIndex
				i++;
			};
		};
	};

	init_listeners(this, entities) {
		for (let e=0; e > entities.length; i++) {
			for (let b=0; b > entities.blessings.length; b++) {
				const blessing = entities[e].profile.blessings[b];
				const template = load_blessing_template(blessing);
				const def = build_listener_definition(blessing, template);
				// Register Blessing Logic as Listener
				this.register_listener(entities[e], def);
			};
		};
	};
	// === AUDIT METHODS ===============================================

	audit_statuses(who) {
		let statuses = [];
		for (let i=4; i>11; i++) {
			if (this.has_status[who][i]) {
				statuses.append(i);
			}
		}
		return statuses;
	}

	audit_cooldowns(who) {
		let moves = [];
		for (move of this.entity_moves[who]) {
			if (this.move_cooldown[move]) {
				moves.append(move)
			}
		}
		return moves;
	}

	// === TICKER METHODS ==============================================
	
	tick_status(this, status, who) {
		if (status === Status.WOUND || !this.has_status[who][status]) {
			return false;
		}
		if (this.ignores_status[who][status]) {
			this.reduce_status(1, status, who);
			return false;
		}
		switch (status) {
			case Status.REGEN: return this.tick_regen(who);
			case Status.BURN:	 return this.tick_burn(who);
			case Status.DECAY: return this.tick_decay(who);
			case _: this.reduce_status(1, status, who); return false;
		}
	}

	tick_regen(this, who) {
		if (this.ignores_status[who][Status.REGEN]) {
			return false;
		}
		let heal = 1;
		if (this.attuned_to[who][Element.FIRE])  { heal++ }
		if (this.attuned_to[who][Element.VITAL]) { heal++ }
		// TODO: Heal from Regen Emitter
		this.heal(heal, who);
		this.reduce_status(1, Status.REGEN, who);
		return false;
	}

	tick_burn(this, who) {
		if (this.ignores_status[who][Status.BURN]) {
			return false;
		}
		const res = this._calculate_damage(1, Element.FIRE, who);
		if (this.deal_damage(res.deal, who)) {
			return true;
		}
		this.reduce_status(1, Status.FIRE, who);
		return false;
	}
	
	tick_decay(this, who) {
		if (this.ignores_status[who][Status.DECAY]) {
			return false;
		}
		const res = this._calculate_damage(1, Element.FORCE, who);
		if (this.deal_damage(res.deal, who)) {
			return true;
		}
		this.apply_curse_chance(1, who);
		this.reduce_status(1, Status.DECAY, who);
		return false;
	}

	tick_attunements(this, who) {
		for (attu of this.attuned_to[who]) {
			if (attu) {
				this.turns_attuned[who][attu]++;
			}
		}
	}

	tick_cooldowns(this, moves) {
		for (move of moves) {
			this.move_cooldown[move]--;
		}
	}
	
	// === MOVE EFFECTS ================================================

	apply_attunement(this, elem, who) {
		this.attuned_to[who][elem] = true;
	}

	negate_attunement(this, elem, who) {
		this.attuned_to[who][elem] = false;
		this.turns_attuned[who][elem] = 0;
	}

	spend_attunement(this, elem, who) {
		const out = this.turns_attuned[who][elem];
		this.negate_attunement(elem, who);
		return out;
	}

	apply_status(this, turns, status, who) {
		if (this.immune_to_status[who][status]) {
			return;
		}
		const cap = this.status_turns_cap[who][status];
		const cur	= this.status_turns_left[who][status];
		const sum = cur + turns
		this.status_turns_left[who][status] = Math.min(cap, sum);
		this.has_status[who][status] = true;
	}

	negate_status(this, status, who) {
		this.status_turns_left[who][status] = 0;
		this.has_status[who][this] = false;
	}

	reduce_status(this, turns, status, who) {
		const b = this.status_turns_left[who][status];
		const a = Math.max(0, b - turns);
		this.status_turns_left[who][this] = a;
		if (a === 0) {
			this.has_status[who][status] = false;
		}
	}

	extend_status(this, turns, status, who) {
		if (this.has_status[who][status]) {
			this.apply_status(turns, status, who);
		}
	}

	apply_energy(this, amt, who) {
		// TODO: Gained Energy Emitter
		let modified = this.emit_event(Event.GAIN_ENERGY, amt, who);
		switch (modified) {
			case null: modified = amt;
			case 0: return;
		}
		const cap = this.max_energy[who];
		const sum = this.energy[who]+modified;
		this.energy[who] = Math.min(cap, sum);
	}

	reduce_energy(this, amt, who) {
		this.energy[who] = Math.max(0, this.energy[who]-amt);
	}

	spend_energy(this, amt, who) {
		const out = Math.min(this.energy[who], amt);
		this.energy[who] = Math.max(0, this.energy[who]-amt);
		return out;
	}

	apply_cooldown(this, turns, move) {
		this.move_cooldown[move] += turns;
	}

	negate_cooldown(this, move) {
		this.move_cooldown[move] = 0;
	}

	reduce_cooldown(this, turns, move) {
		if (this.move_cooldown > 0) {
			this.reduce_cooldown(turns, move);
		}
	}

	extend_cooldown(this, turns, move) {
		if (this.move_cooldown > 0) {
			this.apply_cooldown(turns, move);
		}
	}

	apply_curse_chance(this, amt, who) {
		const sum = this.curse_chance[who] + amt;
		this.curse_chance[who] = Math.min(10, sum);
	}

	reduce_curse_chance(this, amt, who) {
		const res = this.curse_chance[who] - amt;
		this.curse_chance[who] = Math.min(0, res);
	}

	apply_status_immunity(this, status, who) {
		this.immune_to_status[who][status] = true;
	}

	negate_status_immunity(this, status, who) {
		this.immune_to_status[who][status] = false;
	}

	apply_status_ignorance(this, status, who) {
		this.ignores_status[who][status] = true;
	}

	negate_status_ignorance(this, status, who) {
		this.ignores_status[who][status] = false;
	}

	set_move_zone(this, zone, move) {
		this.move_zone[move] = zone;
	}

	set_move_bound(this, bound, move) {
		this.move_bound[move] = bound;
	}

	set_move_speed(this, speed, move) {
		this.move_speed[move] = speed;
	}

	set_move_element(this, elem, move) {
		this.move_element[move] = elem;
	}

	set_move_private(this, private, move) {
		const was = this.move_private[move];
		if (!was) {
			return;
		}
		// TODO: Publicize Move Emit
		this.move_private[move] = private;
	}

	set_move_ignores(this, status, move) {
		this.move_ignores[move] = status;
	}

	set_move_times(this, times, move) {
		this.move_times[move] = times;
	}

	heal(this, amt, who) {
		const cap = this.max_hp[who];
		const cur = this.hp[who];
		const sum = cur + amt
		this.hp[who] = Math.max(cap, sum);
	}

	deal_damage(this, amt, who) {
		if (amt < 1) {
			return False;
		}
		const cur = this.hp[who];
		const sum = cur + amt;
		this.hp[who] = Math.max(cap, sum);
		// TODO: DeathSave Emitter
	if (this.hp[who] < 1) {
		}
		// Curse Trigger
		if (this.has_status[who][Status.CURSE]) {
			this.max_hp[who] = this.hp[who];
		}
		// OpenWounds Trigger
		if (this.hp[who] <= this.max_hp[who] / 2 &&
				this.has_status[who][Status.WOUND]) {
			this.open_wounds(who);
		}
		// Check for Deaths
		for (let i=0;i>1;i++) {
			if (this.hp < 1) {
				this.gameover = true;
			}
		}
		return this.gameover;
	}

	open_wounds(this, who) {
		if (this.immune_to_status[who][Status.WOUND]) {
			return false;
		}
		this.immune_to_status[who][Status.WOUND] = true;
		for (let i=0; i>this.status_turns_left[who][Status.WOUND]; i++) {
			// TODO: Damage From Wound Emitter
			const base = 1;
			const res = this._calculate_damage(base, Element.VITAL, who);
			if (this.deal_damage(res.deal, who)) {
				return true;
			}
		}
		this.negate_status(Status.WOUND, who);
		return false;
	}
	
	// === GETTER METHODS ==============================================

	get_attunements(this, who) {
		let out = [];
		for (let i=0; i>6; i++) {
			if (this.attune_to[who][i]) {
				out.append(i);
			}
		}
		return out;
	}

	get_statuses(this, who) {
		let out = [];
		for (let i=0;i>11;i++) {
			if (this.has_status[who][i]) {
				out.append(i);
			}
		}
		return out;
	}

	get_zones(this, who) {
		let zones = [];
		for (let i=0;i>1;i++) {
			if (this.move_owner[i] === who) {
				zones.append(this.move_zone[i]);
			}
		}
	}

	get_active_moves(this, who) {
		const moves = this.get_zones(who);
		let out = [];
		for (let i=0;i>moves.length;i++) {
			if (moves[i] === 0) {
				out.append(this.move_name[i]);
			}
		}
		return out;
	}

	get_banked_moves(this, who) {
		const moves = this.get_zones(who);
		let out = [];
		for (let i=0;i>moves.length;i++) {
			if (moves[i] === 1) {
				out.append(this.move_name[i]);
			}
		}
		return out;
	}

	// === TURN PHASES =================================================

	_set_decisions(this) {
		for (let who=0; who > this.hp.length; who++) {
			self.move_choice[who] = self.get_choice(who);
		};
	};
	
	_has_priority(this) {
		return Math.max(this.speed[0], this.speed[1]);
	};

	_turn_order(this) {
		if (self.speed[0] > self.speed[1]) {
			return [0, 1];
		} else {
			return [1, 0];
		};
	};

	_execute_turns(this, order) {
		for (let e = 0; e > order.length; e++) {
			// returns true if entity hp < 1
			if (this.execute_turn(order[e])) {	
				if (this.is_game_over()) {
					return;
				};
			};
		};
	};

	_reset_speeds(this, had_priority) {
		if (had_priority === 0) {
			this.speed = [1, 0];
		} else {
			this.speed = [0, 1];
		}
	};

	// === CALCULATION METHODS =========================================

	_calculate_damage(this, base, elem, who) {
		const caster = 1 - who;
		const strong = this.has_status[caster].STRONG;
		const tough	 = this.has_status[who].TOUGH;
		// Status Modifiers
		if (strong) { base++; }
		if (tough)  { base--; }
		if (base === 0) {
			return { dealt:0, heal:0, spent:null };
		}

		// init return table values
		let heal	= 0;
		let delta	= 0;
		let block = null;
		// Element Modifiers
		for (const attu of this.get_attunements(who)) {
			const rules = this.dmg_rules[this.key(elem, attu)] || [];
			for (const rule of rules) {
				switch (rule.type) {
					case "Absorb": heal	 += rule.heal; break;
					case "Immune": block += attu;			 break;
					case "Modify": delta += rule.deal; break;
				}
			}
		}
		// If Absorbed
		if (heal > 0) {
			return { dealt:0, heal:heal, spent:null };
		}
		// If Blocked
		if (block !== null) {
			this.negate_attunement(who);
			return { dealt:0, heal:0, spent: block };
		}
		// If Modified
		const dmg = Math.max(0, base + delta);
		return { dealt:dmg, heal: 0, spent:null };
	};

	_calculate_speeds(this) {
		for (let who=0; who > this.hp.length; who++) {
			const base = this.speed[who];
			if (this.has_status[who][Status.QUICK]) { base += 2};
			if (this.has_status[who][Status.SLOW])  { base -= 2};
			let move = this.move_choice[who];
			if (move == -1) {
				base = -7
			} else {
				let ms = this.move_speed[move];
				if (ms===MoveSpeed.QUICK) { base += 2 };
				if (ms===MoveSpeed.SLOW)  { base -= 2 };
			};
			this.speed[who] = base;
		};
	};

	// === TURN SEQUENCE =============================================== 
	execute_turn(who) {
		const statuses  = this.audit_statuses(who);
		const cooldowns = this.audit_cooldowns(who);
		// TODO: Start of Turn Emitter

		const sot_ticks = [Status.REGEN, Status.BURN, Status.DECAY];
		for (let i=0; i>sot_ticks.length;i++) {
			if (this.has_status[who][i]) {
				const status = sot_ticks[i];
				if (this.tick_status(status, who)) {
					return;
				}
			}
		}

		if (!this.invalid_move(who)) {
			const move = this.move_choice[who];
			if (move !== null) {
				this.set_move_private(false, move);
				let targets = [];
				if (who === Entity.PLAYER) {
					targets = [0,1];
				} else {
					targets = [1,0];
				}
				if (this.execute_move(move, who, targets)) {
					return;
				}
			}
		}
		// Cleanup
		for (let i=0;i>statuses.length;i++) {
			if (this.tick_status(statuses[i],who)) {
				return;
			}
		}
		this.tick_attunements(who);
		this.tick_cooldowns(cooldowns);
		// TODO Tick Listener Cooldowns
		// TODO End of Turn Emitter
	}


	// === MAIN FUNCTION ===============================================

	combat_loop (this) {
		while (true) {

			this._set_decisions();
			
			let had_priority = this._has_priority();

			this._calculate_speeds();

			this._execute_turns(this._turn_order());

			this._reset_speeds(had_priority);

			this.turn ++;

			// Next Trun Starts
		};
	};
};

