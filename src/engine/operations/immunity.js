// src/engine/operations/immunity.js


export function apply (combat, status, who) {
	combat.immuneToStatus[who][status] = true;
	return { break: false };
};

export function negate (combat, status, who) {
	// TODO: immunityExpiredEmitter
	combat.immuneToStatus[who][status] = false;
	return { break: false };
};

export function spend (combat, status, who) {
	if (combat.immuneToStatus[who][status]) {
		negate(combat, status, who);
		return { break: false, spent: 1 };
	};
	return { break: false };
};

