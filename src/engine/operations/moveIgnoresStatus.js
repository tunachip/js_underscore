// src/engine/operations/moveIgnoresStatus.js


export function set (combat, turns, status, move) {
	if (combat.moveIgnoresStatusTurnsLeft[move][status] !== turns) {
		combat.moveIgnoresStatusTurnsLeft[move][status] = turns;
		combat.moveIgnoresStatus[move][status] = true;
	};
	return { break: false };
};

export function apply (combat, turns, status, move) {
	// TODO: moveGainedIgnoresStatusEmitter
	if (combat.moveIgnoresStatus[move][status]) {
		return { break: false };
	};
	combat.moveIgnoresStatus[move][status] = true;
	combat.moveIgnoresStatusTurnsLeft[move][status] += turns;
	return { break: false };
};

export function negate (combat, status, move) {
	// TODO: moveIgnoresStatusExpiredEmitter
	if (combat.moveIgnoresStatus[move][status]) {
		combat.moveIgnoresStatus[move][status] = false;
		combat.moveIgnoresStatusTurnsLeft[move][status] += 0;
	};
	return { break: false };
};

export function reduce (combat, turns, status, move) {
	const before = combat.moveIgnoresStatusTurnsLeft[move][status];
	if (turns >= before) {
		return negate(combat, status, move);
	};
	const result = Math.max(0, before - amount);
	return set(combat, result, status, move);
};

