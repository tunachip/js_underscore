// engine/operations/cooldown_ops.js


export function applyCooldown (combat, turns, move) {
	switch (turns) {
		case 'permanent': {
			combat.moveCooldownTurns[move] = -1; // -1 = permafreeze
			return { break: false };
		}
		default: {
			combat.moveCooldownTurns[move] += turns;
			return { break: false };
		}
	}
}

export function negateCooldown (combat, move) {
	// TODO: moveOffCooldownEmitter
	combat.moveCooldownTurns[move] = 0;
	return { break: false };
}

export function reduceCooldown (combat, turns, move) {
	const before = combat.moveCooldownTurns[move];
	if (turns > before) {
		negateCooldown(combat, move);
	}
	combat.moveCooldownTurns[move] = Math.max(0, before - turns);
	return { break: false };
}

export function extendCooldown (combat, turns, move) {
	if (combat.moveCooldownTurn > 0) {
		return applyCooldown(combat, turns, move);
	}
	return { break: false };
}

export function spendCooldown (combat, turns, move) {
	const before = combat.moveCooldownTurns[move];
	switch (turns) {
		case 0: {
			return { break: false };
		}
		case 'all': {
			negateCooldown(combat, move);
			return { break: false, spent: before };
		}
		default: {
			reduceCooldown(combat, turns, move);
			return { break: false, spent: before };
		}
	}
}

