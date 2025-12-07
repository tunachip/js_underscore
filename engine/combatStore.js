// engine/combatStore.js

import { ELEMENTS } from './globals/elements.js';
import { STATUSES, STATUS_CAPS } from './globals/statuses.js';


// CombatState: data-only container for an active combat
export class CombatState {
	constructor () {
		this.turn = 1;
		this.gameover = false;
		this.temp = {}; // scratch space for ops

		// Entity vectors
		this.entityName			 = [];
		this.isPlayer				 = [];
		this.isElite				 = [];
		this.isAlive				 = [];
		this.maxHp					 = [];
		this.hp							 = [];
		this.maxEnergy			 = [];
		this.energy					 = [];
		this.speed					 = [];
		this.curseChance		 = [];
		this.attunedTo			 = [];
		this.turnsAttuned		 = [];
		this.hasStatus			 = [];
		this.statusTurnsLeft = [];
		this.statusTurnsCap  = [];
		this.ignoresStatus	 = [];
		this.immuneToStatus  = [];
		this.turnsSkipped		 = [];
		this.moveChoice			 = [];

		// Move vectors
		this.moveName					 = [];
		this.moveOwner				 = [];
		this.moveZone					 = [];
		this.moveType					 = [];
		this.moveElement			 = [];
		this.moveSpeed				 = [];
		this.moveIterations		 = [];
		this.moveOperations		 = [];
		this.moveIsPrivate		 = [];
		this.moveIgnoresStatus = [];
		this.moveCooldownTurns = [];
		this.moveIsBound			 = [];
	}
}

export function createCombatState (player, encounters = []) {
	const combat = new CombatState();
	addEntity(combat, player, true);
	for (const entity of encounters) {
		addEntity(combat, entity, false);
	}
	return combat;
}

export function addEntity (combat, entity, isPlayer) {
	const idx = combat.entityName.length;
	combat.entityName.push(entity.name);
	combat.isPlayer.push(isPlayer);
	combat.isElite.push(Boolean(entity.isElite));
	combat.isAlive.push(true);
	combat.maxHp.push(entity.maxHp ?? 20);
	combat.hp.push(entity.hp ?? entity.maxHp ?? 20);
	combat.maxEnergy.push(entity.maxEnergy ?? 6);
	combat.energy.push(entity.energy ?? 0);
	combat.speed.push(0);
	combat.curseChance.push(0);
	combat.attunedTo.push(initElementMap(false));
	combat.turnsAttuned.push(initElementMap(0));
	combat.hasStatus.push(initStatusMap(false));
	combat.statusTurnsLeft.push(initStatusMap(0));
	combat.statusTurnsCap.push({ ...STATUS_CAPS });
	combat.ignoresStatus.push(initStatusMap(false));
	combat.immuneToStatus.push(initStatusMap(false));
	combat.turnsSkipped.push(0);
	combat.moveChoice.push(null);

	const activeMoves = entity.moves?.active ?? [];
	const bankedMoves = entity.moves?.banked ?? [];
	for (const move of activeMoves) {
		addMove(combat, move, idx, 'active');
	}
	for (const move of bankedMoves) {
		addMove(combat, move, idx, 'banked');
	}
}

// addMove: push a move into combat move vectors.
export function addMove (combat, move, ownerIndex, zone) {
	combat.moveName.push(move.name ?? 'Unnamed Move');
	combat.moveOwner.push(ownerIndex);
	combat.moveZone.push(zone ?? 'active');
	combat.moveType.push(move.type ?? 'attack');
	combat.moveElement.push(move.element ?? 'vital');
	combat.moveSpeed.push(move.speed ?? 'normal');
	combat.moveIterations.push(move.iterations ?? 1);
	combat.moveOperations.push(move.operations ?? []);
	combat.moveIsPrivate.push(Boolean(move.initsPublic) === false);
	combat.moveIgnoresStatus.push(normalizeIgnoresStatus(move.ignoresStatus));
	combat.moveCooldownTurns.push(move.initialCooldown ?? 0);
	combat.moveIsBound.push(Boolean(move.initsBound));
}

function initElementMap (value) {
	const out = {};
	for (const element of ELEMENTS) {
		out[element] = value;
	}
	return out;
}

function initStatusMap (value) {
	const out = {};
	for (const status of STATUSES) {
		out[status] = value;
	}
	return out;
}

function normalizeIgnoresStatus (ignoresStatus = {}) {
	const out = initStatusMap(false);
	for (const status of Object.keys(ignoresStatus)) {
		out[status] = Boolean(ignoresStatus[status]);
	}
	return out;
}


