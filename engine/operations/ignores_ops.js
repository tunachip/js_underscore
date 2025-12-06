// engine/operations/ignores_ops.js


export function applyIgnoresStatus (combat, status, who) {
	combat.ignoresStatus[who][status] = true;
	return { break: false };
}

export function negateIgnoresStatus (combat, status, who) {
	combat.ignoresStatus[who][status] = false;
	return { break: false };
}

export function spendIgnoresStatus (combat, status, who) {
	if (combat.ignoresStatus[who][status]) {
		negateIgnoresStatus(combat, status, who);
		return { break: false, spent: 1 };
	};
	return { break: false };
}

