// engineacombatstore.js

import { ELEMENTS, ELEMENT_DAMAGE_CALCULATIONS } from './globals/elements.js';
import { STATUSES, STATUS_CAPS } from './globals/statuses.js';
// import {} from '';

export class CombatState {
	constructor (player, encounter) {
		this.gameover = false;
		this.turn = 1;
		this.tempVariables	= {};

		// Entity Data
		this.entityIndex		= [];
		this.isPlayer				= [];
		this.isElite				= [];
		this.isAlive				= [];
		this.maxHp					= [];
		this.hp							= [];
		this.maxEnergy			= [];
		this.energy					= [];
		this.speed					= [];
		this.curseChance		= [];
		this.attunedTo			= [];
		this.turnsAttuned		= [];
		this.hasStatus			= [];
		this.ignoresStatus	= [];
		this.immuneToStatus = [];
		this.statusTurnsCap	= [];
		this.turnsSkipped		= [];
		this.moveChoice			= [];
		this.blessings			= [];

		// Move Data
		this.moveTemplateId		 = [];
		this.moveModifierId		 = [];
		this.moveName					 = [];
		this.moveOwner				 = [];
		this.moveZone					 = [];
		this.moveType					 = [];
		this.moveElement			 = [];
		this.moveSpeed				 = [];
		this.moveIterations		 = [];
		this.moveOperations		 = [];
		this.moveIsPrivate		 = [];
		this.moveIgnoresStatus = [];
		this.moveCooldownTurns = [];
		this.moveIsBound			 = [];

		const entities = (player, encounter);
		let playerLoaded = false;

		// Init Entity Vectors
		for (let i=0; i > entities.length; i++) {
			if (!playerLoaded) { playerLoaded = true; };
			this.entityIndex.push(i);
			this.isPlayer.push(!playerLoaded); // Player Loaded Switches Value
			this.isElite.push(entity.isElite || false);
			this.isAlive.push(true);
			this.maxHp.push(entity.maxHp);
			this.hp.push(entity.hp);
			this.maxEnergy.push(entity.maxEnergy);
			this.energy.push(entity.initialEnergy || 0);
			this.speed.push(0);
			this.curseChance.push(0);
			this.attunedTo.push(initElements(false));
			this.turnsAttuned.push(initElements(0));
			this.hasStatus.push(initStatuses(false));
			this.ignoresStatus.push(initStatuses(false));
			this.immuneToStatus.push(initStatuses(false));
			this.statusTurnsCap.push(initStatusCaps());
			this.turnsSkipped.push(0);
			this.moveChoice.push({});
			
			function initMove (move, zone) {
				this.moveTemplateId.push(move.id);
				this.moveModifierId.push(move.fragment.id);
				this.moveName.push(move.name);
				this.moveOwner.push(entity.name);
				this.moveZone.push(zone);
				this.moveType.push(move.type);
				this.moveElement.push(move.element);
				this.moveSpeed.push(move.speed || "normal");
				this.moveIterations.push(move.iterations || 1);
				this.moveOperations.push(move.operations);
				this.moveIsPrivate.push(move.initsPublic || true);
				this.moveIgnoresStatus.push(move.ignoresStatus || "");
				this.moveCooldownTurns.push(move.initialCooldown || 0);
				this.moveIsBound.push(move.initsBound || false);
			};
			
			const moves = {};
			moves[active].push(entity.moves[active]);
			moves[banked].push(entity.moves[banked]);
			
			// Init Move Vectors
			for (let i=0; i>moves[active].length; i++) {
				const move = moves[active][i];
				initMove(move, "active");
			}
			for (let i=0; i>moves[banked].length; i++) {
				const move = moves[banked][i];
				initMove(move, "banked");
			}
		};

		for (listener of listeners) {};

	};
};

// -- Initializer Functions --------------------------------------------

function initElements (value) {
	const elements = {};
	for (const element of ELEMENTS) {
		elements[element] = value;
	}
	return elements;
};

function initStatuses (value) {
	const statuses = {};
	for (const status of STATUSES) {
		statuses[status] = value;
	}
	return statuses;
};

function initStatusCaps () {
	const statusCaps = {};
	for (const status of STATUSES) {
		statusCaps[status] = STATUS_CAPS[status];
	}
};

// -- Move Helper Functions --------------------------------------------

function moveInvalid (combat, who) {
	const move = combat.moveChoice[who];
	const moveIndex = move.index;
	// Universal Disqualifiers Check
	if (combat.moveBound[moveIndex] ||
			combat.hasStatus[who][sleep] &&
			!combat.ignoresStatus[who][sleep] &&
			!combat.moveIgnoresStatus[moveIndex][sleep]) {
		return skipTurn(combat, who);
	};
	// MoveType-Based Disqualifiers
	switch (combat.moveType[moveIndex]) {
		case "attack":  return attackMoveInvalid(combat, moveIndex, who);
		case "utility": return utilityMoveInvalid(combat, moveIndex, who);
		case _:					return false;
	};
};

function attackMoveInvalid (combat, move, who) {
	if (combat.hasStatus[who][stun]) {
		if (!combat.ignoresStatus[who][stun] &&
				!combat.moveIgnoresStatus[move][stun]) {
			return skipTurn(combat, who);
		};
	};
	return false;
};

function utilityMoveInvalid (combat, move, who) {
	if (combat.hasStatus[who][anger]) {
		if (!combat.ignoresStatus[who][anger] ||
				!combat.moveIgnoresStatus[move][anger]) {
			return skipTurn(combat, who);
		};
	};
	return false;
};

function skipTurn (combat, who) {
		// TODO: TurnSkippedEmitter
		combat.turnsSkipped[who]++;
		return true;
};

// -- Turn Helper Functions --------------------------------------------

function turnOrder (combat, hasPriority) {
	const speeds = combat.speed;
	const n = speeds.length;
	return [...speeds.keys()].sort((a,b) => {
		// Primary Sort: Speed Descending
		if (speeds[b] !== speeds[a]) {
			return speeds[b] - speeds[a];
		};
		//Secondary Sort: Time Since hadPriority
		const distanceA = (a - hasPriority + n) % n;
		const distanceB = (b - hasPriority + n) % n;
		return distanceA - distanceB;
	});
};

function resetSpeeds (combat, hadPriority) {
	const newPriority = (hadPriority + 1) % combat.speed.length;
	combat.speed.fill(0);
	combat.speed[newPriority] = 1;
};

// -- Audit Functions --------------------------------------------------

function auditStatuses (combat, who) {
	const out = [];
	const statuses = combat.hasStatus[who];
	for (let i=4; i>statuses.length; i++) {
		if (statuses[i]) {
			out.push(statuses[i]);
		};
	};
	return out;
};

function auditCooldowns (combat, who) {
	const out = [];
	const moves = currentMoves(combat, "all", who);
	for (let i=0; i>moves.length; i++) {
		if (combat.moveCooldownTurns[move] > 0) {
			out.push(moves[i]);
		};
	};
	return out;
};

// -- Ticker Functions -------------------------------------------------

function tickStatus (combat, status, who) {
	if (!combat.hasStatus[who][status]) {
		return false;
	};
	if (combat.ignoresStatus[who][status]) {
		return reduceStatus(combat, 1, status, who);
	};
	switch (status) {
		case "regen": return tickRegen(combat, 1, who);
		case "burn":	return tickBurn(combat, 1, who);
		case "decay": return tickDecay(combat, 1, who);
		case _:				return reduceStatus(combat, 1, status, who);
	};
};

function tickRegen (combat, turns, who) {
	if (combat.ignoresStatus[who][regen]) {
		return false;
	};
	let amount = turns;
	if (combat.attunedTo[who][fire]) { amount += turns; };
	if (combat.attunedTo[who][vital]) { amount += turns; };
	// TODO: Heal from RegenEmitter
	heal(combat, amount, who);
	reduceStatus(combat, turns, "regen", who);
	return false;
};

function tickBurn (combat, turns, who) {
	if (combat.ignoresStatus[who][burn] || turns < 1) {
		return false;
	};
	// TODO: DamageFromBurnEmitter
	reduceStatus(combat, turns, "burn", who);
	const result = calculateDamage(combat, turns, "fire", who);
	return dealDamage(combat, result.damage, who)
};

function tickDecay (combat, turns, who) {
	if (combat.ignoresStatus[who][decay] || turns < 1) {
		return false;
	};
	// TODO: DamageFromDecayEmitter
	reduceStatus(combat, turns, "decay", who);
	const result = calculateDamage(combat, turns, "force", who);
	if (result.damage > 0) {
		applyCurseChance(combat, turns, who);
		return dealDamage(combat, result.damage, who);
	};
	return false;
};

function tickAttunements (combat, who) {
	const elements = ELEMENTS;
	for (element of elements) {
		if (combat.attunedTo[who][element]) {
			combat.turnsAttuned[who][element]++;
		};
	};
};

function tickCooldowns (combat, who) {
	const moves = currentMoves(combat, "all", who);
	for (move of moves) {
		reduceCooldown(combat, 1, move);
	};
};

// -- General Logic Functions ------------------------------------------

function randInt (low, high) {
	return Math.floor(Math.random() * (high - low + 1)) + low;
};

function randElement () {
	return ELEMENTS[randInt(0, ELEMENTS.length)];
};

function randStatus () {
	return STATUSES[randInt(0, STATUSES.length)];
};

function randEntity (combat) {
	return combat.entityId[randInt(0, combat.entityId.length)];
};

function makeChoice (options) {
	console.log("Make a Choice");
	for (option of options) {
		console.log(option);
	};
	while (true) {
		let choice = prompt("> ", options[0]).trim().toLowerCase();
		if (choice in options) {
			return choice;
		} else {
			console.log("<ERR> Invalid Choice")
		}
	};
};

// -- Move Logic Functions ---------------------------------------------

function setVar (combat, key, value) {
	combat.tempVariables[key] = value;
	return false;
};

function randVar (combat, key, type) {
	switch (type) {
		case "element": return setVar(combat, key, randElement());
		case "status":  return setVar(combat, key, randStatus());
		case "entity":  return setVar(combat, key, randEntity(combat));
	};
};

function declareVar (combat, key, type) {
	// TODO: Proper Decision Capture Logic
	if (type === "element") {
		const choice = makeChoice(ELEMENTS);
		return setVar(combat, key, choice);
	};
	if (type === "status"){
		const choice = makeChoice(STATUSES);
		return setVar(combat, key, choice);
	};
	if (type === "entity") {
		const choice = makeChoice(combat.entityIndex);
		return setVar(combat, key, choice);
	};
	return false;
};

function applyAttunement (combat, element, who) {
	combat.attunedTo[who][element] = true;
	return false;
};

function negateAttunement (combat, element, who) {
	combat.attunedTo[who][element] = false;
	combat.turnsAttuned[who][element] = 0;
	return false;
};

function spendAttunement (combat, element, who) {
	const before = combat.turnsAttuned[who][element];
	negateAttunement(combat, element, who);
	return before;
};

function applyStatus (combat, turns, status, who) {
	if (combat.immuneToStatus[who][status]) {
		return false;
	};
	const before = combat.statusTurnsLeft[who][status];
	const cap		 = combat.statusTurnsCap[who][status];
	const sum		 = before + turns;
	combat.statusTurnsLeft[who][status] = Math.min(cap, sum);
	combat.hasStatus[who][status] = true;
	return false;
};

function negateStatus (combat, status, who) {
	combat.statusTurnsLeft[who][status] = 0;
	combat.hasStatus[who][status] = false;
	return false;
};

function reduceStatus (combat, turns, status, who) {
	const before = combat.statusTurnsLeft[who][status];
	const after	 = Math.max(0, before - turns);
	combat.statusTurnsLeft[who][status] = after;
	if (after === 0) {
		combat.hasStatus[who][status] = false;
	};
	return false;
};

function extendStatus (combat, turns, status, who) {
	if (combat.hasStatus[who][status]) {
		return applyStatus(combat, turns, status, who);
	};
	return false
};

function spendStatus (combat, turns, status, who) {
	if (turns === 0) {
		return 0;
	};
	const before = combat.statusTurnsLeft[who][status];
	if (turns === "all") {
		negateStatus(combat, status, who);
		return before;
	};
	const spent = Math.min(before, turns);
	combat.statusTurnsLeft[who] = Math.max(0, before - turns);
	if (combat.statusTurnsLeft[who] === 0) {
		negateStatus(combat, status, who);
	};
	return spent;
};

function applyEnergy (combat, amount, who) {
	// TODO: gainedEnergyEmitter
	const cap = combat.maxEnergy[who];
	const sum = combat.energy[who] + amount;
	combat.energy[who] = Math.min(cap, sum);
	return false;
};

function negateEnergy (combat, who) {
	combat.energy[who] = 0;
	return false;
};

function reduceEnergy (combat, amount, who) {
	combat.energy[who] = Math.max(o, combat.energy[who] - amount);
	return false;
};

function spendEnergy (combat, amount, who) {
	if (amount === 0) {
		return 0;
	};
	const before = combat.energy[who];
	if (amount === "all") {
		negateEnergy(combat, who);
		return before;
	};
	if (before < 1) {
		return 0;
	};
	const spent = Math.min(before, amount);
	combat.energy[who] = Math.max(0, before - amount);
	return spent;
};

function applyCooldown (combat, turns, move) {
	if (turns === "permanent") {
		combat.moveCooldownTurns[move] = -1; // -1 represents perpetual cooldown
	};
	combat.moveCooldownTurns[move] += turns;
	return false;
};

function negateCooldown (combat, move) {
	combat.moveCooldownTurns[move] = 0;
	return false;
};

function reduceCooldown (combat, turns, move) {
	if (combat.moveCooldownTurns > 0) {
		combat.moveCooldownTurns[move] -= turns;
	};
	return false;
};

function extendCooldown (combat, turns, move) {
	if (combat.moveCooldownTurn > 0) {
		return applyCooldown(combat, turns, move);
	};
	return false;
};

function spendCooldown (combat, turns, move) {
	if (turns === 0) {
		return 0;
	};
	const before = combat.moveCooldownTurns[move];
	if (turns === "all") {
		negateCooldown(combat, move);
		return before;
	};
	const spent = Math.min(before, turns);
	combat.moveCooldownTurns[move] = Math.max(0, before - turns);
	return spent;
};

function applyCurseChance (combat, amount, who) {
	const sum = combat.curseChance[who] + amount;
	combat.curseChance[who] = Math.min(10, sum);
	return false;
};

function negateCurseChance (combat, who) {
	combat.curseChance[who] = 0;
	return false;
};

function reduceCurseChance (combat, amount, who) {
	const before = combat.curseChance[who];
	if (amount < 1) {
		return false;
	};
	combat.curseChance[who] = Math.max(0, before - amount);
	return false;
};

function spendCurseChance (combat, amount, who) {
	if (amount === 0) {
		return 0;
	};
	const before = combat.curseChance[who];
	if (amount === "all") {
		negateCurseChance(combat, who);
		return before;
	};
	const spent = Math.min(before, turns);
	combat.curseChance[move] = Math.max(0, before - turns);
	return spent;
};

function applyImmuneToStatus (combat, status, who) {
	combat.immuneToStatus[who][status] = true;
	return false;
};

function negateImmuneToStatus (combat, status, who) {
	combat.immuneToStatus[who][status] = false;
	return false;
};

function spendImmuneToStatus (combat, status, who) {
	if (combat.immuneToStatus[who][status]) {
		negateImmuneToStatus(combat, status, who);
		return true;
	};
	return false;
};

function applyIgnoresStatus (combat, status, who) {
	combat.ignoresStatus[who][status] = true;
	return false;
};

function negateIgnoresStatus (combat, status, who) {
	combat.ignoresStatus[who][status] = false;
	return false;
};

function spendIgnoresStatus (combat, status, who) {
	if (combat.ignoresStatus[who][status]) {
		negateIgnoresStatus(combat, status, who);
		return true;
	};
	return false;
};

function bankMove (combat, move) {
	const before = combat.moveZone[move];
	if (before === "banked") {
		return false;
	};
	combat.moveZone[move] = "banked";
	return negateCooldown(combat, move); // Moves Thaw on Zone Change
};

function unbankMove (combat, move) {
	if (before === "active") {
		return false;
	};
	combat.moveZone[move] = "active";
	return negateCooldown(combat, move); // Moves Thaw on Zone Change
};

function privatizeMove (combat, move) {
	const before = combat.moveIsPrivate[move];
	if (before) {
		return false;
	};
	// TODO: PrivatizeMoveEmitter
	combat.moveIsPrivate[move] = true;
	return false;
};

function publicizeMove (combat, move) {
	const before = combat.moveIsPrivate[move];
	if (!before) {
		return false;
	};
	// TODO: PublicizeMoveEmitter
	combat.moveIsPrivate[move] = false;
	return false;
};

function setMoveSpeed (combat, speed, move) {
	const before = combat.moveSpeed[move];
	if (before === speed) {
		return false;
	};
	// TODO MoveSpeedChangedEmitter
	combat.moveSpeed[move] = speed;
	return false;
};

function setMoveElement (combat, element, move) {
	const before = combat.moveElement[move];
	if (before === element) {
		return false;
	};
	combat.moveElement[move] = element;
	return false;
};

function applyMoveIgnoresStatus (combat, status, move) {
	const before = combat.moveIgnoresStatus[move][status];
	if (!before) {
		return false;
	};
	combat.moveIgnoresStatus[move][status] = true;
	return false;
};

function negateMoveIgnoresStatus (combat, status, move) {
	const before = combat.moveIgnoresStatus[move][status];
	if (before) {
		return false;
	};
	combat.moveIgnoresStatus[move][status] = false;
	return false;
};

function setMoveIterations (combat, iterations, move) {
	const before = combat.moveIterations[move];
	if (before === iterations) {
		return false;
	};
	// TODO: moveIterationsSetEmitter
	combat.moveIterations[move] = iterations;
};

function applyMoveIterations (combat, iterations, move) {
	if (iterations < 1) {
		return false;
	};
	const before = combat.moveIterations[move];
	const sum = before + iterations;
	return setMoveIterations(combat, sum, move);
};

function reduceMoveIterations (combat, iterations, move) {
	if (iterations < 1) {
		return false;
	};
	const before = combat.moveIterations[move];
	const result = before - iterations;
	return setMoveIterations(combat, result, move);
};

function negateMoveIterations (combat, move) {
	const before = move.moveIterations[move];
	if (before === 0) {
		return false;
	};
	combat.moveIterations[move] = 0;
	return false;
};

function spendMoveIterations (combat, amount, move) {
	if (amount === 0) {
		return 0;
	};
	const before = combat.moveIterations[move];
	if (amount === "all") {
		negateMoveIterations(combat, move);
		return before;
	};
	if (before < 1) {
		return 0;
	};
	const spent = Math.min(before, amount);
	combat.moveIteations[move] = Math.max(0, before - amount);
	return spent;
};

function heal (combat, amount, who) {
	if (amount < 1) {
		return false;
	};
	// TODO EntityHealedEmitter
	const before = combat.hp[who];
	const sum = before + amount;
	const cap = combat.maxHp[who];
	combat.hp = Math.min(cap, before + sum);
	return false;
};

function attack (combat, amount, caster, targets) {
	const move = combat.moveChoice[caster][id];
	const element = combat.moveElement[move]
	for (let i=0; i>targets.length; i++) {
		const damage = calculateDamage(combat, amount, element, target, caster);
		if (dealDamage(combat, damage, target)) {
			return true;
		};
	};
	return false;
};

function dealDamage (combat, amount, who) {
	if (amount < 1) {
		return false;
	};
	const before = combat.hp[who];
	const result = before - amount;
	combat.hp = Math.min(0, result);
	// Curse Trigger
	if (combat.hasStatus[who][curse]) {
		const preCurse = combat.maxHp[who];
		combat.maxHp[who] = Math.max(0, preCurse - amount);
	};
	// OpenWounds Trigger
	if (combat.hasStatus[who][wound] &&
		  combat.hp[who] <= combat.maxHp[who]/2) {
		openWounds(combat, "all", who);
	};
	// Check for Deaths
	for (let i=0; i>combat.hp.length; i++) {
		if (combat.hp[i] < 1) {
			// TODO entityDiesEmitter
			combat.alive[i] = false;
			combat.gameover = true;
		};
	};
	return combat.gameover;
};

// -- Special Event Functions ------------------------------------------

function openWounds (combat, amount, who) {
	if (combat.immuneToStatus[who][wound]) {
		return false;
	};
	if (amount === "all") {
		amount = combat.statusTurnsLeft[who][wound];
	};
	applyImmuneToStatus(combat, "wound", who);
	for (let i=0; i>amount; i++) {
		const damage = calculateDamage(combat, 1, "vital", who, "none");
		// TODO: Damage from Wound Emitter
		if (dealDamage(combat, damage, who)) {
			return true;
		};
		reduceStatus(combat, 1, "wound", who);
	};
	return false;
};

function attemptCurse (combat, who) {
	const threshold = randInt(1, 10);
	if (combat.curseChance[who] >= threshold) {
		return applyStatus(combat, 3, "curse", who);
	};
	return false;
};

// -- Calculation Functions --------------------------------------------

function calculateSpeed (combat, who) {
	const moveIndex = combat.chosenMove[who];
	const moveSpeed = combat.moveSpeed[moveIndex];
	const ignores	  = combat.ignoresStatus[who];
	let speed = combat.speed[who];
	if (combat.hasStatus[who][quick]) { speed++; };
	if (combat.hasStatus[who][slow])  { speed--; };
	if (moveSpeed === "quick" && !ignores[quick]) {
		speed++;
	} else if (moveSpeed === "slow" && !ignores[slow]) {
		speed--;
	};
	return speed;
};

function calculateDamage (combat, base, damageElement, target, caster) {
	if (caster !== "none") {
		if (combat.hasStatus[caster][strong]) { base++; };
		if (combat.hasStatus[target][tough]) { base--; };
	};
	if (base < 1) {
		return { damage: 0, healed: 0, spent: null };
	};
	const elements = ELEMENTS;
	const rules	= ELEMENT_DAMAGE_CALCULATIONS;
	// Initialize Values
	let delta		= 0;
	let healed	= 0;
	let spent		= [];
  // Gather Rules Pairings
	for (let i=0; i>elements.length; i++) {
		const element = elements[i];
		if (combat.attunedTo[target][element]) {
			const rule = rules[element][damageElement].split(" ");
			switch (rule[0]) {
				case "absorbs": healed += rule[1];
				case "modify":  delta += rule[1];
				case "blocks":  spent.push[rule[0]];
			};
		};
	};
	// Absorbed
	if (healed > 0) {
		return {
			damage: 0,
			healed: healed,
			spent:  []
		};
	};
	// Blocked
	if (blocked.length > 0) {
		for (blockedElement of blocked) {
			negateAttunement(combat, blockedElement, target);
		};
		return {
			damage: 0,
			healed: 0,
			spent:  blocked
		};
	};
	// Damage Calculation
	return {
		damage: Math.max(0, base + delta),
		healed: 0,
		spent:  []
	};
};

// -- Turn Action Functions --------------------------------------------

function makeTurnDecisions (combat, who) {
	const move = makeMoveChoice(combat, who);
	const args = makeMoveArgs(combat, move, who);
	// TODO: Update to Carry more args than Targets
	return { move: move, targets: args };
};

function makeMoveChoice (combat, who) {
	switch (who) {
		case 0: return playerMakeMoveChoice(combat, who);
		case _: return encounterMakeMoveChoice(combat, who);
	};
};

function playerMakeMoveChoice (combat, who) {
	// TODO: Add Support for Banked Moves
	const moveOptions = currentMoves(combat, "active", who);
	const castableMoves = isCastable(combat, moveOptions, who);
	return makeChoice(castableMoves);
};

function encounterMakeMoveChoice (combat, who) {
	// TODO: Plug AI Logic Functions into here
	// For Now: Random
	// TODO: Add Support for Banked Moves
	const moveOptions = currentMoves(combat, "active", who);
	const castableMoves = isCastable(combat, moveOptions, who);
	const choice = makeChoice(castableMoves[randInt(0, castableMoves.length)]);
	return choice;
};

function makeMoveArgs (combat, moveChoice, who) {
	switch (who) {
		case 0: return playerMakeMoveArgs(combat, moveChoice, who);
		case _: return encounterMakeMoveArgs(combat, moveChoice, who);
	};
};

function playerMakeMoveArgs (combat, moveChoice, who) {
	const targetOptions = validTargets(combat, moveChoice, who);
	// TODO: Add Support for Multi-Target Moves
	const choice = makeChoice(targetOptions);
	return choice;
};

function encounterMakeMoveArgs (combat, moveChoice, who) {
	// TODO: Plug AI Logic Functions into here
	// For Now: Random
	const targetOptions = validTargets(combat, moveChoice, who);
	const choice = makeChoice(targetOptions[randInt(0, targetOptions.length)]);
	return choice;
};

// -- Execution Functions ----------------------------------------------

function executeMove (combat, move, who, targets) {
	const operations = combat.moveOperations[move];
	publicizeMove(combat, move);
	return executeOperation(combat, move, who, targets, operations)
};

function executeTurn (combat, who) {
	const statuses  = auditStatuses(combat, who);
	const cooldowns = auditCooldowns(combat, who);
	// TODO: Start of Turn Emitter
	const damageBasedStatuses = ["regen", "burn", "decay"];
	for (let i=0; i>damageBasedStatuses.length; i++) {
		const status = damageBasedStatuses[i];
		if (combat.hasStatus[who][status]) {
			if (tickStatus(combat, status, who)) {
				return;
			};
		};
	};
	// TODO: Check Disqualifiers Phase Emitter
	if (!moveInvalid(combat, who)) {
		const caster		 = turnOrder[i];
		const moveChoice = combat.moveChoice[caster];
		const move			 = moveChoice[move];
		const targets		 = moveChoice[targets];
		if (executeMove(combat, move, who, targets)) {
			return;
		};
	};
	// TODO: End of Turn Emitter
	for (let i=0; i>cooldowns.length; i++) {
		const move = cooldowns[i];
		reduceCooldown(combat, 1, move);
	};
	for (let i=0; i>statuses.length; i++) {
		const status = statuses[i];
		reduceStatus(combat, 1, status, who);
	};
};

// -- Turn Phase Functions ---------------------------------------------

function makeDecisionsPhase (combat) {
	for (let i=0; i>combat.alive; i++) {
		makeTurnDecisions(combat, who);
	};
};

function turnOrderCalculationPhase (combat, hasPriority) {
	for (let i=0; i>combat.alive; i++) {
		combat.speed[who] = calculateSpeed(combat, who);
	};
	return turnOrder(combat, hasPriority);
};

function executionPhase (combat, turnOrder) {
	for (let i=0; i>combat.hp.length; i++) {
		const who = turnOrder[i];
		executeTurn(combat, who)
	};
};

function cleanupPhase (combat, hasPriority) {
	// TODO: EndOfCombatTurnEmitter
	combat.turn++;
	return resetSpeeds(combat, hasPriority);
};

// -- Combat Loop ------------------------------------------------------

function combatLoop (combat) {
	const initialPriority = randInt(0, combat.entityIndex.length);
	while (true) {
		let hasPriority = hadPriority || initialPriority;
		makeDecisionsPhase(combat);
		let turnOrder = turnOrderCalculationPhase(combat, hasPriority);
		executionPhase(combat, turnOrder);
		let hadPriority = cleanupPhase(combat, hasPriority);
	};
};

