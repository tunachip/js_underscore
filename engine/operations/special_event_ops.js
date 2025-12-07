// engine/operations/special_event_ops.js

import { reduceStatus, negateStatus, applyStatus } from './status_ops.js';
import { dealDamage, calculateDamage } from './damage_ops.js';
import { applyImmuneToStatus } from './immunity_ops.js';
import { randInt } from './logic_ops.js';


export function openWounds (combat, amount, who) {
	const before = combat.statusTurnsLeft[who]['wound'];
	if (combat.ignoresStatus[who]['wound']) {
		negateStatus(combat, 'wound', who);
		return { break: false };
	}
	if (amount === 'all') {
		amount = before;
	} else {
		amount = Math.min(before, amount);
	}
	// entities gain immune to wound when wounds open
	applyImmuneToStatus(combat, 'wound', who);
	for (let i=0; i<amount; i++) {
		const damage = calculateDamage(combat, 'vital', 1, who);
		const result = dealDamage(combat, damage, who);
		if (result.break) {
			return { break: true };
		}
		reduceStatus(combat, 1, 'wound', who);
	}
	return { break: false };
}

export function attemptCurse (combat, who) {
	const threshold = randInt(1, 10);
	if (combat.curseChance[who] >= threshold) {
		return applyStatus(combat, 3, 'curse', who);
	}
	return { break: false };
}

