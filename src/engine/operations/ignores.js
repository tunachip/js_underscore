// srv/engine/operations/ignores.js


export function apply (combat, status, who) {
	combat.ignoresStatus[who][status] = true;
	return { break: false };
};

export function negate (combat, status, who) {
	combat.ignoresStatus[who][status] = false;
	return { break: false };
};

export function spend (combat, status, who) {
	if (combat.ignoresStatus[who][status]) {
		negate(combat, status, who);
		return { break: false, spent: 1 };
	};
	return { break: false };
};

