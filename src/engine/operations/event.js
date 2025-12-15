// src/engine/operations/event.js

import { Immunity, Status, Damage, Utility } from '#engine/operations';


export function heal (combat, amount, who) {
	if (amount < 1 ) {
		return { break: false };
	};
	// TODO: entityHealedEmitter
	const before = combat.hp[who];
	const sum = before + amount;
	const cap = combat.maxHp[who];
	combat.hp[who] = Math.min(cap, sum);
	// TODO: fullHealEmitter
	if (sum >= cap) {
		// full health restores vulnerability to wounds
		if (combat.immuneToStatus[who]['wound']) {
			Immunity.apply(combat, 'wound', who);
		};
	};
	return { break: false };
};

export function openWounds (combat, amount, who) {
	const before = combat.statusTurnsLeft[who]['wound'];
	if (combat.ignoresStatus[who]['wound']) {
		Status.negate(combat, 'wound', who);
		return { break: false };
	};
	if (amount === 'all') {
		amount = before;
	} else {
		amount = Math.min(before, amount);
	};
	// entities gain immune to wound when wounds open
	Immunity.apply(combat, 'wound', who);
	//for (let i=0; i<amount; i++) {
	for (_ of amount) {
		const calculated = Damage.calculate(combat, 'vital', 1, who);
		if (calculated.damage > 0) {
			const results = Damage.deal(combat, calculated.damage, who);
			if (results.break) {
				return { break: true };
			};
		};
		Status.reduce(combat, 1, 'wound', who);
	};
	return { break: false };
};

export function attemptCurse (combat, who) {
	const threshold = Utility.randInt(1, 10);
	if (combat.curseChance[who] >= threshold) {
		return Status.apply(combat, 3, 'curse', who);
	};
	return { break: false };
};

export function skipTurn (combat, who) {
	combat.turnsSkipped[who] += 1;
	return { break: true };
};

