// src/engine/combat/audit.js

import { Entity } from '#engine/combat';


export function statuses (combat, who) {
	const out = [];
	const statuses = combat.hasStatus[who];
	for (const status of Object.keys(statuses)) {
		if (statuses[status]) {
			out.push(status);
		};
	};
	return out;
};

export function cooldowns (combat, who) {
	const out = [];
	const moves = Entity.moves(combat, 'all', who);
	for (const move of moves) {
		if (combat.moveCooldownTurns[move] > 0) {
			out.push(move);
		};
	};
	return out;
};

