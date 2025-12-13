// src/engine/operations/curseChance.js


export function apply (combat, amount, who) {
	const before = combat.curseChance[who];
	const cap = 10;
	const sum = before + amount;
	combat.curseChance[who] = Math.min(cap, sum);
	return { break: false };
};

export function negate (combat, who) {
	// TODO: curseChanceDepletedEmitter
	combat.curseChance[who] = 0;
	return { break: false };
};

export function reduce (combat, amount, who) {
	const before = combat.curseChance[who];
	if (amount >= before) {
		return negate(combat, who);
	};
	const after = Math.max(0, before - amount);
	combat.curseChance[who] = after;
	return { break: false };
};

export function spend (combat, amount, who) {
	const before = combat.curseChance[who];
	switch (amount) {
		case 0: {
			return { break: false, spent: 0 };
		};
		case 'all': {
			negate(combat, who);
			return { break: false, spent: before };
		};
		default: {
			reduce(combat, amount, who);
			const spent = Math.min(before, amount);
			return { break: false, spent: spent };
		};
	};
};


