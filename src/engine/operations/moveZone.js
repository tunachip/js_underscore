// src/engine/operations/moveZone.js

import { Cooldown } from '#engine/operations';


export function set (combat, zone, move) {
	if (combat.moveZone[move] !== zone &&
			combat.moveZoneLocked !== true) {
		// TODO: Move Zone Changed Emitter
		combat.moveZone[move] = zone;
		Cooldown.negate(combat, move);
	};
	return { break: false };
};

export function bank (combat, move) {
	return set(combat, 'banked', move);
};

export function unbank (combat, move) {
	return set(combat, 'active', move);
};
