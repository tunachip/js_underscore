// engine/operations/status_special_ops.js


export function applyCurseChance (combat, amount, who) {
	const before = combat.curseChance[who];
	const cap = 10;
	const sum = before + amount;
	combat.curseChance[who] = Math.min(cap, sum);
	return { break: false };
}

export function negateCurseChance (combat, who) {
	// TODO: curseChanceDepletedEmitter
	combat.curseChance[who] = 0;
	return { break: false };
}

export function reduceCurseChance (combat, amount, who) {
	const before = combat.curseChance[who];
	if (amount >= before) {
		return negateCurseChance(combat, who);
	}
	const after = Math.max(0, before - amount);
	combat.curseChance[who] = after;
	return { break: false };
}

export function spendCurseChance (combat, amount, who) {
	const before = combat.curseChance[who];
	switch (amount) {
		case 0: {
			return { break: false, spent: 0 };
		}
		case 'all': {
			negateCurseChance(combat, who);
			return { break: false, spent: before };
		}
		default: {
			reduceCurseChance(combat, amount, who);
			const spent = Math.min(before, amount);
			return { break: false, spent: spent };
		}
	}
}


