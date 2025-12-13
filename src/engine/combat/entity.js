// src/engine/combat/entity.js

import { ELEMENTS, STATUSES } from '../constants.js'


export function currentMoves (combat, zone, who) {
	const moves = combat.moveOwner;
	const out = [];
	for (const i of moves) {
		if (combat.moveOwner[i] === who) {
			if (zone === 'all' || combat.moveZone[i] === zone) {
				out.push(i);
			};
		};
	};
};

export function currentStatuses (combat, who) {
	const out = {};
	for (const status of STATUSES) {
		if (combat.hasStatus[who][status]) {
			out.push(status);
		};
	};
	return out;
};

export function currentAttunements (combat, who) {
	const out = {};
	for (const element of ELEMENTS) {
		if (combat.attunedTo[who][element]) {
			out.push(element);
		};
	};
	return out;
};

function skipTurn (combat, who) {
	combat.turnsSkipped[who] += 1;
	return true;
};

export function invalidMoveChoice (combat, who) {
	const choice = combat.moveChoice[who];
	if (choice < 0) {
		// -1 used to represent 'no choice made'
		combat.turnsSkipped[who] += 1;
		return true;
	};
	const moveIndex = choice.move;
	if (combat.hasStatus[who]['sleep'] &&
			combat.ignoresStatus[who]['sleep'] !== true &&
			combat.moveIgnoresStatus[moveIndex]['sleep'] !== true) {
			return skipTurn(combat, who);
	};
	// Move-type disqualifiers
	if (combat.moveType[moveIndex] === 'attack') {
		if (combat.hasStatus[who]['stun'] &&
				combat.ignoresStatus[who]['stun'] !== true &&
				combat.moveIgnoresStatus[moveIndex]['stun'] !== true) {
			return skipTurn(combat, who);
		};
	};
	if (combat.moveType[moveIndex] === 'utility') {
		if (combat.hasStatus[who]['anger'] &&
				combat.ignoresStatus[who]['anger'] !== true &&
				combat.moveIgnoresStatus[moveIndex]['anger'] !== true) {
			return skipTurn(combat, who);
		};
	};
	return false;
};

