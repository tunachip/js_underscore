// engine/operations/immunity_ops.js


export function applyImmuneToStatus (combat, status, who) {
	combat.immuneToStatus[who][status] = true;
	return { break: false };
}

export function negateImmuneToStatus (combat, status, who) {
	// TODO: immunityExpiredEmitter
	combat.immuneToStatus[who][status] = false;
	return { break: false };
}

export function spendImmuneToStatus (combat, status, who) {
	if (combat.immuneToStatus[who][status]) {
		negateImmuneToStatus(combat, status, who);
		return { break: false, spent: 1 };
	}
	return { break: false };
}

