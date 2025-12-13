// src/engine/operations/cooldown.js


export function apply (combat, turns, move) {
	switch (turns) {
		case 'permanent': {
			combat.moveCooldownTurns[move] = -1; // -1 = permafreeze
			return { break: false };
		};
		default: {
			combat.moveCooldownTurns[move] += turns;
			return { break: false };
		};
	};
};

export function negate (combat, move) {
	// TODO: moveOffCooldownEmitter
	combat.moveCooldownTurns[move] = 0;
	return { break: false };
};

export function reduce (combat, turns, move) {
	const before = combat.moveCooldownTurns[move];
	if (turns > before) {
		return negate(combat, move);
	};
	combat.moveCooldownTurns[move] = Math.max(0, before - turns);
	return { break: false };
};

export function extend (combat, turns, move) {
	if (combat.moveCooldownTurns[move] > 0) {
		return apply(combat, turns, move);
	};
	return { break: false };
};

export function spend (combat, turns, move) {
	const before = combat.moveCooldownTurns[move];
	switch (turns) {
		case 0: {
			return { break: false };
		};
		case 'all': {
			negate(combat, move);
			return { break: false, spent: before };
		};
		default: {
			reduce(combat, turns, move);
			const spent = Math.min(before, turns);
			return { break: false, spent: spent };
		};
	};
};

