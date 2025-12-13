// src/engine/operations/status.js


export function apply (combat, turns, status, who) {
	if (combat.immuneToStatus[who][status]) {
		return { break: false };
	};
	const before = combat.statusTurnsLeft[who][status];
	const cap		 = combat.statusTurnsCap[who][status];
	const sum		 = before + turns;
	combat.statusTurnsLeft[who][status] = Math.min(cap, sum);
	combat.hasStatus[who][status] = true;
	return { break: false };
};

export function negate (combat, status, who) {
	// TODO: statusDepletedEmitter
	combat.statusTurnsLeft[who][status] = 0;
	combat.hasStatus[who][status] = false;
	return { break: false };
};

export function reduce (combat, turns, status, who) {
	const before = combat.statusTurnsLeft[who][status];
	if (turns >= before) {
		return negateStatus(combat, status, who);
	};
	const after = Math.max(0, before - turns);
	combat.statusTurnsLeft[who][status] = after;
	return { break: false };
};

export function extend (combat, turns, status, who) {
	if (combat.hasStatus[who][status]) {
		return applyStatus(combat, turns, status, who);
	};
	return { break: false };
};

export function spend (combat, turns, status, who) {
	const before = combat.statusTurnsLeft[who][status];
	switch (turns) {
		case 0: {
			return { break: false, spent: 0 };
		};
		case 'all': {
			negateStatus(combat, status, who);
			return { break: false, spent: before };
		};
		default: {
			reduceStatus(combat, turns, status, who);
			const spent = Math.min(before, turns);
			return { break: false, spent: spent };
		};
	};
};

