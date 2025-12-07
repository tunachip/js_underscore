// engine/operations/change_move_ops.js

import { negateCooldown } from './cooldown_ops.js';


export function bankMove (combat, move) {
	// TODO: moveBankedEmitter
	if (combat.moveZone[move] !== 'banked') {
		combat.moveZone[move] = 'banked';
		return negateCooldown(combat, move); // Moves Thaw on Zone Change
	}
	return { break: false };
}

export function unbankMove (combat, move) {
	// TODO: moveUnbankedEmitter
	if (combat.moveZone[move] !== 'active') {
		combat.moveZone[move] = 'active';
		return negateCooldown(combat, move); // Moves Thaw on Zone Change
	}
	return { break: false };
}

export function privatizeMove (combat, move) {
	// TODO: movePrivatizedEmitter
	if (combat.moveIsPrivate[move] !== true) {
		combat.moveIsPrivate[move] = true;
	}
	return { break: false };
}

export function publicizeMove (combat, move) {
	// TODO: movePublicizedEmitter
	if (combat.moveIsPrivate[move]) {
		combat.moveIsPrivate[move] = false;
	}
	return { break: false };
}

export function setMoveSpeed (combat, speed, move) {
	// TODO: moveSpeedChangedEmitter
	if (combat.moveSpeed[move] !== speed) {
		combat.moveSpeed[move] = speed;
	}
	return { break: false };
}

export function setMoveElement (combat, element, move) {
	// TODO: moveElementChangedEmitter
	if (combat.moveElement[move] !== element) {
		combat.moveElement[move] = element;
	}
	return { break: false };
}

export function applyMoveIgnoresStatus (combat, status, move) {
	// TODO: moveGainedIgnoresStatusEmitter
	if (combat.moveIgnoresStatus[move][status] !== true) {
		combat.moveIgnoresStatus[move][status] = true;
	}
	return { break: false };
}

export function negateMoveIgnoresStatus (combat, status, move) {
	// TODO: moveIgnoresStatusExpiredEmitter
	if (combat.moveIgnoresStatus[move][status]) {
		combat.moveIgnoresStatus[move][status] = false;
	}
	return { break: false };
}

export function setMoveIterations (combat, amount, move) {
	// TODO: moveIterationsSetEmitter
	if (combat.moveIterations[move] !== amount) {
		combat.moveIterations[move] = amount;
	}
	return { break: false };
}

export function applyMoveIterations (combat, amount, move) {
	const before = combat.moveIterations[move];
	const sum = before + amount;
	return setMoveIterations(combat, sum, move);
}

export function reduceMoveIterations (combat, amount, move) {
	const before = combat.moveIterations[move];
	if (amount > before) {
		return negateMoveIterations(combat, move);
	}
	const result = Math.max(0, before - amount);
	return setMoveIterations(combat, result, move);
}

export function negateMoveIterations (combat, move) {
	if (combat.moveIterations[move] !== 0) {
		combat.moveIterations[move] = 0;
	}
	return { break: false };
}

export function spendMoveIterations (combat, amount, move) {
	const before = combat.moveIterations[move];
	switch (amount) {
		case 0: {
			return { break: false, spent: 0 };
		}
		case 'all': {
			negateMoveIterations(combat, move);
			return { break: false, spent: before };
		}
		default: {
			reduceMoveIterations(combat, amount, move);
			const spent = Math.min(before, amount);
			return { break: false, spent: spent};
		}
	}
}

