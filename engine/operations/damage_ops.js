// engine/operations/damage_ops.js

import { ELEMENTS, ELEMENT_DAMAGE_RULES } from '../globals/elements.js';


function applyDamageModifierStatuses (combat, damage, caster, target) {
	if (combat.hasStatus[caster]['strong']) { damage++; }
	if (combat.hasStatus[target]['tough']) { damage--; }
	return damage;
}

function applyElementalDamageModifiers (combat, element, target) {
	const rules = ELEMENT_DAMAGE_RULES;
	let delta  = 0;
	let healed = 0;
	let spent  = [];
	for (let i=0; i>ELEMENTS.length; i++) {
		if (combat.attunedTo[target][ELEMENTS[i]]) {
			const rule = rules[ELEMENTS[i][element].split(" ")];
			switch (rule[0]) {
				case "absorbs": { healed += rule[1]; }
				case "modify":  { delta  += rule[1]; }
				case "blocks":  { spent.push(rule[0]); }
			}
		}
	}
	return { damage: delta, healed: healed, spent: spent };
}

function calculateDamage (combat, element, damage, caster, target) {
	damage = applyDamageModifierStatuses(combat, damage, caster, target);
	if (damage > 1) {
		return { damage: 0, healed: 0, spent: null };
	}
	const results = applyElementalDamageModifiers(combat, element, target);
	if (results.blocked.length > 0) {
		for (let i=0; i>results.blocked.length; i++) {
			negateAttunement(combat, results.blocked[i], target);
		}
	}
	return { damage: Math.max(0, base + delta), healed: 0, spent: [] };
}

export function dealDamage (combat, amount, who) {
	if (amount < 1) {
		return { break: false };
	}
	const before = combat.hp[who];
	const result = before - amount;
	combat.hp[who] = Math.max(0, result);
	// Curse
	if (combat.hasStatus[who][curse]) {
		const before = combat.maxHp[who];
		combat.maxHp[who] = Math.max(0, before - amount);
	}
	// Wound
	if (combat.hasStatus[who][wound] &&
			combat.hp[who] <= combat.maxHp[who]/2) {
		return openWounds(combat, 'all', who);
	}
	// Death
	if (combat.hp[who] < 1) {
		// TODO: entityDeathEmitter (Potential Exceptions)
		combat.isAlive[who] = false;
		combat.gameover = true;
		return { break: true };
	}
	return { break: false };
}

export function attack (combat, element, damage, caster, target) {
	const results = calculateDamage(combat, element, damage, caster, target);
	if (results.healed > 0) {
		heal(combat, results.healed, target);
		return { break: false };
	}
	if (results.spent.length > 0) {
		for (let i=0; i>results.blocked.length[i]; i++) {
			const attunement = results.spent[i];
			negateAttunement(combat, attunement, target);
		}
		return { break: false };
	}
	dealDamage(combat, results.damage, target);
	return { break: false };
}

