// src/engine/operations/moveIterations.js


export function set (combat, amount, move) {
	// TODO: moveIterationsSetEmitter
	if (combat.moveIterations[move] !== amount) {
		combat.moveIterations[move] = amount;
	};
	return { break: false };
};

export function apply (combat, amount, move) {
	const before = combat.moveIterations[move];
	const sum = before + amount;
	return set(combat, sum, move);
};

export function reduce (combat, amount, move) {
	const before = combat.moveIterations[move];
	if (amount >= before) {
		return negate(combat, move);
	};
	const result = Math.max(0, before - amount);
	return set(combat, result, move);
};

export function negate (combat, move) {
	if (combat.moveIterations[move] !== 0) {
		combat.moveIterations[move] = 0;
	};
	return { break: false };
};

export function spend (combat, amount, move) {
	const before = combat.moveIterations[move];
	switch (amount) {
		case 0: {
			return { break: false, spent: 0 };
		};
		case 'all': {
			negate(combat, move);
			return { break: false, spent: before };
		};
		default: {
			reduce(combat, amount, move);
			const spent = Math.min(before, amount);
			return { break: false, spent: spent };
		};
	};
};

