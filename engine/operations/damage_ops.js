// engine/operations/damage_ops.js

import { ELEMENTS, ELEMENT_DAMAGE_RULES } from '../globals/elements.js';
import { negateAttunement } from './attunement_ops.js';
import { negateImmuneToStatus } from './immunity_ops.js';
import { openWounds } from './special_event_ops.js'; 


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
	for (let i=0; i<ELEMENTS.length; i++) {
		const attunement = ELEMENTS[i];
		if (combat.attunedTo[target][attunement]) {
			const rule = rules[attunement][element].split(' ');
			if (rule[0] === 'absorbs') {
				healed += Number(rule[1]);
			}
			if (rule[0] === 'modify') {
				delta += Number(rule[1]);
			}
			if (rule[0] === 'blocks') {
				spent.push(attunement);
			}
		}
	}
	return { damage: delta, healed: healed, spent: spent };
}

export function calculateDamage (combat, element, damage, target) {
	if (damage < 1) {
		return { damage: 0, healed: 0, spent: null };
	}
	const results = applyElementalDamageModifiers(combat, element, target);
	if (results.spent.length > 0) {
		return { damage: 0, healed: 0, spent: results.spent };
	}
	if (results.healed > 0) {
		return { damage: 0, healed: results.healed, spent: [] };
	}
	damage += results.damage;
	return { damage: Math.max(0, damage), healed: 0, spent: [] };
}

export function dealDamage (combat, amount, who) {
	if (amount < 1) {
		return { break: false };
	}
	const before = combat.hp[who];
	const result = before - amount;
	combat.hp[who] = Math.max(0, result);
	// Curse
	if (combat.hasStatus[who]['curse']) {
		const before = combat.maxHp[who];
		combat.maxHp[who] = Math.max(0, before - amount);
	}
	// Wound
	if (combat.hasStatus[who]['wound'] &&
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

export function heal (combat, amount, who) {
	if (amount < 1 ) {
		return { break: false };
	}
	// TODO: entityHealedEmitter
	const before = combat.hp[who];
	const sum = before + amount;
	const cap = combat.maxHp[who];
	combat.hp[who] = Math.min(cap, sum);
	// TODO: fullHealEmitter
	if (sum >= cap) {
		// full health restores vulnerability to wounds
		if (combat.immuneToStatus[who]['wound']) {
			negateImmuneToStatus(combat, 'wound', who);
		}
	}
	return { break: false };
}

export function attack (combat, element, damage, caster, target) {
	damage = applyDamageModifierStatuses(combat, damage, caster, target);
	const results = calculateDamage(combat, element, damage, target);
	if (results.healed > 0) {
		return heal(combat, results.healed, target);
	}
	if (results.spent.length > 0) {
		for (let i=0; i<results.spent.length; i++) {
			const attunement = results.spent[i];
			negateAttunement(combat, attunement, target);
		}
		return { break: false };
	}
	dealDamage(combat, results.damage, target);
	return { break: false };
}

