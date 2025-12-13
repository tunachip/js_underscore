// engine/operations/logic_ops.js


import { ELEMENTS } from '../globals/elements.js';
import { STATUSES } from '../globals/statuses.js';

export function randInt (low, high) {
	return Math.floor(Math.random() * (high - low + 1)) + low;
}

export function randElement (range) {
	switch (range) {
		case 'full': {
			return ELEMENTS[randInt(0, ELEMENTS.length)];
		}
		default: {
			const low = range['low'];
			const high = range['high'];
			return ELEMENTS[randInt(low, high)];
		}
	}
}

export function randStatus (range) {
	switch (range) {
		case 'full': {
			return STATUSES[randInt(0, STATUSES.length)];
		}
		default: {
			const low = range['low'];
			const high = range['high'];
			return STATUSES[randInt(low, high)];
		}
	}
}

export function randEntity (combat, scope) {
	// TODO: Add Support for Allies
	switch (scope) {
		case 'full': {
			const low = 0;
			const high = combat.entityName.length-1;
			return randInt(low, high);
		}
		case 'player': {
			return 0;
		}
		case 'encounter': {
			const low = 1;
			const high = combat.entityName.length-1;
			return randInt(low, high);
		}
	}
}

function filterByZone (combat, candidates, zone) {
	switch (zone) {
		case 'any': {
			return candidates;
		}
		default: {
			if (zone !== 'any') {
				for (let i=candidates.length-1; i>=0; i--) {
					const move = candidates[i];
					if (combat.moveZone[move] !== zone) {
						candidates.splice(i, 1);
					}
				}
			}
			return candidates;
		}
	}
}

function filterByCooldownState (combat, candidates, cooldownState) {
	switch (cooldownState) {
		case 'any': {
			return candidates;
		}
		case 'permanent': {
			for (let i=candidates.length-1; i>=0; i--) {
				const move = candidates[i];
				if (combat.moveCooldownTurns[move] !== -1) {
					candidates.splice(i, 1);
				}
			}
			return candidates;
		}
		case 'onCooldown': {
			for (let i=candidates.length-1; i>=0; i--) {
				const move = candidates[i];
				if (combat.moveCooldownTurns[move] !== 0) {
					candidates.splice(i, 1);
				}
			}
			return candidates;
		}
		case 'notOnCooldown': {
			for (let i=candidates.length-1; i>=0; i--) {
				const move = candidates[i];
				if (combat.moveCooldownTurns[move] === 0) {
					candidates.splice(i, 1);
				}
			}
			return candidates;
		}
	}
}

function filterBySpeed (combat, candidates, speeds) {
	if (speeds === 'any') {
		return candidates;
	}
	for (let i=candidates.length-1; i>=0; i--) {
		const move = candidates[i];
		if (!speeds.includes(combat.moveSpeed[move])) {
			candidates.splice(i, 1);
		}
	}
	return candidates;
}

function entityOwnedMoves (combat, conditions, who) {
	let candidates = [];
	for (let i=0; i<combat.moveOwner.length; i++) {
		if (who === 'any' || combat.moveOwner[i] === who) {
			candidates.push(i);
		}
	}
	if (candidates.length > 0) {
		candidates = filterByZone(combat, candidates, conditions['zone']);
	}
	if (candidates.length > 0) {
		candidates = filterByCooldownState(combat, candidates, conditions['cooldownState']);
	}
	if (candidates.length > 0) {
		candidates = filterBySpeed(combat, candidates, conditions['speeds']);
	}
	return candidates;
}

export function randMove (combat, scope) {
	const who = scope.entity;
	const conditions = scope.conditions;
	const candidates = entityOwnedMoves(combat, conditions, who);
	return candidates[randInt(0, candidates.length-1)];
}

