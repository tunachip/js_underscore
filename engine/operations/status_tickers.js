// engine/operations/status_tickers.js

import { reduceStatus } from './status_ops.js';
import { applyCurseChance } from './curse_chance_ops.js';
import { calculateDamage, dealDamage, heal } from './damage_ops.js';

export function tickRegen (combat, turns, who) {
	if (combat.attunedTo[who]['fire'])  { turns++; }
	if (combat.attunedTo[who]['vital']) { turns++; }
	reduceStatus(combat, turns, 'regen', who);
	return heal(combat, turns, who);
}

export function tickBurn (combat, turns, who) {
	reduceStatus(combat, turns, 'burn', who);
	const result = calculateDamage(combat, 'fire', turns, who);
	return dealDamage(combat, result.damage, who);
}

export function tickDecay (combat, turns, who) {
	reduceStatus(combat, turns, 'decay', who);
	const result = calculateDamage(combat, 'force', turns, who);
	if (result.damage > 0) {
		applyCurseChance(combat, turns, who);
	}
	return dealDamage(combat, result.damage, who);
}

export function tickStatus (combat, status, who) {
	if (!combat.hasStatus[who][status]) {
		return { break: false };
	}
	if (combat.ignoresStatus[who][status]) {
		return reduceStatus(combat, 1, status, who);
	}
	switch (status) {
		case 'regen': { return tickRegen(combat, 1, who); }
		case 'burn': {	return tickBurn(combat, 1, who); }
		case 'decay': { return tickDecay(combat, 1, who); }
		case 'wound': { return { break: false }; }
		default: {			return reduceStatus(combat, 1, status, who); }
	}
}

