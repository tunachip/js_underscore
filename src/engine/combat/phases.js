// 

import { Audit, Entity } from '#engine/combat';
import { Op } from '#engine';

function resetSpeeds (combat, hadPriority) {
	const hasPriority = (hadPriority + 1) % combat.speed.length;
	calculateSpeeds(combat, hasPriority);
	return hasPriority;
};

function calculateSpeeds (combat, hasPriority) {
	combat.speed.fill(0);
	combat.speed[hasPriority] = 1;
};

function turnOrder (combat, hadPriority) {
	const speeds = combat.speed;
	const n = speeds.length;
};


// CombatTurn Phases

export function makeDecisions () {};

export function calculateTurnOrder () {
	calculateSpeeds(combat, hadPriority)
};

export function entityTurns () {};

export function cleanup () {};

export function handleGameResults () {};


// EntityTurn Phases

export function audit (combat, who) {
	return {
		statuses: Audit.statuses(combat, who),
		cooldowns: Audit.cooldowns(combat, who),
	};
};

export function tickDamageStatuses (combat, who, statuses) {
	for (const status of ['regen', 'burn', 'decay']) {
		if (statuses?.status) {
			statuses.pop(status);
			const result = Op.Tick.status(combat, status, who);
			if (result?.break) {
				return true;
			};
		};
	};
};

export function checkDisqualifiers (combat, who) {
	return Entity.invalidMoveChoice(combat, who)
};

function executeMove (combat, move, who targets) {
	const moveData = {
		element: combat.moveElement[move],
		iterations: combat.moveIterations[move],
		speed: combat.moveSpeed[move],
		type: combat.moveType[move],
		name: combat.moveName[move],
	};
	const ctx = createInterpreterContext({
		moveIndex: move,
		caster: who,
		targets,
		moveData,
	});
	const operations = 
};


export function execution (combat, who) {
	const choice = combat.moveChoice[who];
	const move = choice.move;
	const targets = choice.targets;
	const result = executeMove(combat, move, who, targets);
	if (result?.break) {
		return true;
	};
};

export function cleanup (combat, statuses, cooldowns, who) {
	for (const move of cooldowns) {
		Op.Cooldown.reduce(combat, 1, move);
	};
	for (const status of statuses) {
		Op.Status.reduce(combat, 1, status, who);
	};
};

