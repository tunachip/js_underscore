// src/engine/combat/entityHelpers.js

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
	return out;
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

export function skipTurn (combat, who) {
	combat.turnsSkipped[who] += 1;
	return true;
};

function isInvalid (disqualifier, who) {
if (combat.hasStatus[who][disqualifier] &&
		combat.ignoresStatus[who][disqualifier] !== true &&
		combat.moveIgnoresStatus[moveIndex][disqualifier] !== true) {
		return true;
	};
};

export function invalidMoveChoice (combat, who) {
	const choice = combat.moveChoice[who];
	if (choice < 0) {
		// -1 used to represent 'no choice made'
		combat.turnsSkipped[who] += 1;
		return true;
	};
	
	if (!isInvalid('sleep', who)) {
		switch (choice) {
			case 'attack':  {
				return isInvalid('stun', who)
			};
			case 'utility': {
				return isInvalid('anger', who)
			};
		};
	};
};

