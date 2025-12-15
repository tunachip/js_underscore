// engine/combatLoop.js
// Text-input based combat loop (placeholder until UI/AI plug in).

import { executeOperations } from './opcode_reader.js';

import { resolveOperations, createInterpreterContext } from './interpreters.js';
import { publicizeMove } from './operations/change_move_ops.js';
import { reduceCooldown } from './operations/cooldown_ops.js';
import { reduceStatus } from './operations/status_ops.js';
import { tickStatus } from './operations/status_tickers.js';
import { playerChoice } from './operations/var_setter_ops.js';


// --- Audit helpers ---------------------------------------------------

function auditStatuses (combat, who) {
	const out = [];
	const statuses = combat.hasStatus[who];
	for (const status of Object.keys(statuses)) {
		if (statuses[status]) {
			out.push(status);
		}
	}
	return out;
}

function auditCooldowns (combat, who) {
	const out = [];
	const moves = currentMoves(combat, 'all', who);
	for (const move of moves) {
		if (combat.moveCooldownTurns[move] > 0) {
			out.push(move);
		}
	}
	return out;
}

// --- Move helpers ----------------------------------------------------

function currentMoves (combat, scope, who) {
	const moves = [];
	for (let i = 0; i < combat.moveOwner.length; i++) {
		if (combat.moveOwner[i] !== who) continue;
		if (scope === 'all' || combat.moveZone[i] === scope) {
			moves.push(i);
		}
	}
	return moves;
}

function moveInvalid (combat, who) {
	const choice = combat.moveChoice[who];
	if (!choice) return true;
	const moveIndex = choice.move;
	// Universal disqualifiers
	if (combat.moveIsBound[moveIndex]) {
		return skipTurn(combat, who);
	}
	if (combat.hasStatus[who]['sleep'] &&
			combat.ignoresStatus[who]['sleep'] !== true &&
			combat.moveIgnoresStatus[moveIndex]['sleep'] !== true) {
		return skipTurn(combat, who);
	}
	// Move-type disqualifiers
	if (combat.moveType[moveIndex] === 'attack') {
		if (combat.hasStatus[who]['stun'] &&
				combat.ignoresStatus[who]['stun'] !== true &&
				combat.moveIgnoresStatus[moveIndex]['stun'] !== true) {
			return skipTurn(combat, who);
		}
	}
	if (combat.moveType[moveIndex] === 'utility') {
		if (combat.hasStatus[who]['anger'] &&
				combat.ignoresStatus[who]['anger'] !== true &&
				combat.moveIgnoresStatus[moveIndex]['anger'] !== true) {
			return skipTurn(combat, who);
		}
	}
	return false;
}

function validTargets (combat, caster) {
	const targets = [];
	for (let i = 0; i < combat.isAlive.length; i++) {
		if (!combat.isAlive[i]) continue;
		if (i === caster) continue;
		targets.push(i);
	}
	return targets;
}

function encounterChoice (options) {
	const idx = Math.floor(Math.random() * options.length);
	return options[idx];
}

function chooseMove (combat, who) {
	const options = currentMoves(combat, 'active', who);
	if (options.length === 0) return null;
	if (who === 0) {
		return playerChoice(options);
	}
	return encounterChoice(options);
}

function chooseTarget (combat, who) {
	const options = validTargets(combat, who);
	if (options.length === 0) return null;
	if (who === 0) {
		return playerChoice(options);
	}
	return encounterChoice(options);
}

function makeTurnDecisions (combat, who) {
	const move = chooseMove(combat, who);
	const target = chooseTarget(combat, who);
	combat.moveChoice[who] = { move, target };
}

function executeMove (combat, move, who, targets) {
	const moveMeta = {
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
		moveMeta,
	});
	const operations = resolveOperations(combat.moveOperations[move], ctx);
	publicizeMove(combat, move);
	return executeOperations(combat, move, who, targets, operations);
}

// --- Turn execution --------------------------------------------------

function executeTurn (combat, who) {
	const statuses  = auditStatuses(combat, who);
	const cooldowns = auditCooldowns(combat, who);
	
	const damageBasedStatuses = ['regen', 'burn', 'decay'];
	for (const status of damageBasedStatuses) {
		if (combat.hasStatus[who][status]) {
			const result = tickStatus(combat, status, who);
			if (result?.break) {
				return true;
			}
		}
	}
	
	if (!moveInvalid(combat, who)) {
		const choice = combat.moveChoice[who];
		const move = choice.move;
		const target = choice.target;
		const result = executeMove(combat, move, who, [target]);
		if (result?.break) {
			return true;
		}
	}
	
	for (const move of cooldowns) {
		reduceCooldown(combat, 1, move);
	}
	
	for (const status of statuses) {
		reduceStatus(combat, 1, status, who);
	}
	
	return false;
}

// --- Turn order helpers ----------------------------------------------

function calculateSpeeds (combat, hadPriority) {
	for (let i = 0; i < combat.speed.length; i++) {
		// basic priority grant: previous priority gets speed 1, others 0
		combat.speed[i] = 0;
	}
	if (hadPriority >= 0 && hadPriority < combat.speed.length) {
		combat.speed[hadPriority] = 1;
	}
}

function turnOrder (combat, hasPriority) {
	const speeds = combat.speed;
	const n = speeds.length;
	return [...speeds.keys()].sort((a,b) => {
		if (speeds[b] !== speeds[a]) {
			return speeds[b] - speeds[a];
		}
		const distanceA = (a - hasPriority + n) % n;
		const distanceB = (b - hasPriority + n) % n;
		return distanceA - distanceB;
	});
}

function resetSpeeds (combat, hadPriority) {
	const newPriority = (hadPriority + 1) % combat.speed.length;
	calculateSpeeds(combat, newPriority);
	return newPriority;
}

// --- Combat loop -----------------------------------------------------

export function combatLoop (combat) {
	let hadPriority = 0;
	calculateSpeeds(combat, hadPriority);

	while (!combat.gameover) {
		
		for (let i = 0; i < combat.isAlive.length; i++) {
			if (!combat.isAlive[i]) continue;
			makeTurnDecisions(combat, i);
		};
		
		const order = turnOrder(combat, hadPriority);
		
		for (const who of order) {
			if (!combat.isAlive[who]) continue;
			const ended = executeTurn(combat, who);
			if (ended) {
				combat.gameover = true;
				break;
			};
		};
		
		hadPriority = resetSpeeds(combat, hadPriority);
		
		combat.turn += 1;
	
	};
	
	return combat;

};

