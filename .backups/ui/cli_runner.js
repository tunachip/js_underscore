// ui/cli_runner.js
// Minimal CLI combat loop where you pick moves for both sides.

import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import { createCombatState } from '../engine/combatStore.js';
import { executeOperations } from '../engine/opcode_reader.js';
import { basicWaterAttack } from '../engine/templates/water_attack_template.js';
import { basicFireAttack } from '../engine/templates/fire_attack_template.js';
import { ELEMENTS } from '../engine/globals/elements.js';
import { STATUSES } from '../engine/globals/statuses.js';

function deepClone (obj) {
	return JSON.parse(JSON.stringify(obj));
}

function resolveOps (move, caster, target) {
	const resolveArg = (key, value) => {
		if (value === 'meta') {
			if (key === 'element')	return move.element;
			if (key === 'times')		return move.iterations ?? 1;
			if (key === 'target')		return target;
			return move[key];
		}
		if (value === 'caster')		return caster;
		if (value === 'target')		return target;
		return value;
	};
	const resolveArgs = (args) => {
		const out = {};
		for (const [k, v] of Object.entries(args ?? {})) {
			out[k] = Array.isArray(v) ? v.map(item => resolveArg(k, item)) : resolveArg(k, v);
		}
		return out;
	};
	const walk = (ops) => ops.map(op => {
		const resolved = { ...op, args: resolveArgs(op.args) };
		if (resolved.code === 'loop' &&
				Array.isArray(resolved.args.inner)) {
			resolved.args.inner = walk(resolved.args.inner);
		}
		if (resolved.code === 'sequence' &&
				Array.isArray(resolved.args.inner)) {
			resolved.args.inner = walk(resolved.args.inner);
		}
		if (resolved.code === 'branch') {
			if (Array.isArray(resolved.args._then)) {
				resolved.args._then = walk(resolved.args._then);
			}
			if (Array.isArray(resolved.args._else)) {
				resolved.args._else = walk(resolved.args._else);
			}
		}
		return resolved;
	});
	return walk(deepClone(move.operations));
}

function logState (combat) {
	console.log('\n=== Entities ===');
	const entities = combat.entityName.map((name, idx) => ({
		idx,
		name,
		player:				combat.isPlayer[idx],
		hp:						`${combat.hp[idx]}/${combat.maxHp[idx]}`,
		energy:				`${combat.energy[idx]}/${combat.maxEnergy[idx]}`,
		speed:				combat.speed[idx],
		curseChance:	combat.curseChance[idx],
		alive:				combat.isAlive[idx],
	}));
	console.table(entities);

	console.log('=== Attunements ===');
	const attuneRows = combat.entityName.map((name, idx) => {
		const row = { idx, name };
		for (const el of ELEMENTS) {
			row[el] = combat.attunedTo[idx][el] ? 'Y' : '-';
		}
		return row;
	});
	console.table(attuneRows);

	console.log('=== Statuses ===');
	const statusRows = combat.entityName.map((name, idx) => {
		const row = { idx, name };
		for (const st of STATUSES) {
			row[st] = combat.hasStatus[idx][st] ? combat.statusTurnsLeft[idx][st] : '-';
		}
		return row;
	});
	console.table(statusRows);

	console.log('=== Moves ===');
	const moves = combat.moveName.map((name, idx) => ({
		idx,
		name,
		owner:			combat.moveOwner[idx],
		zone:				combat.moveZone[idx],
		type:				combat.moveType[idx],
		element:		combat.moveElement[idx],
		speed:			combat.moveSpeed[idx],
		iterations: combat.moveIterations[idx],
		cooldown:		combat.moveCooldownTurns[idx],
		private:		combat.moveIsPrivate[idx],
		bound:			combat.moveIsBound[idx],
	}));
	console.table(moves);
}

function movesForOwner (combat, ownerIdx) {
	const out = [];
	for (let i = 0; i < combat.moveOwner.length; i++) {
		if (combat.moveOwner[i] === ownerIdx &&
				combat.moveZone[i] === 'active') {
			out.push(i);
		}
	}
	return out;
}

async function chooseFromList (rl, prompt, options) {
	while (true) {
		console.log(prompt);
		options.forEach((opt, i) => {
			console.log(`${i}: ${opt}`);
		});
		const answer = await rl.question('> ');
		const idx = Number(answer.trim());
		if (!Number.isNaN(idx) &&
				idx >= 0 &&
				idx < options.length) {
			return idx;
		}
		console.log('Invalid choice, try again.');
	}
}

async function chooseMoveAndTarget (rl, combat, casterIdx) {
	const moveIndices = movesForOwner(combat, casterIdx);
	const moveLabels = moveIndices.map(i => `${combat.moveName[i]} (element: ${combat.moveElement[i]}, dmg: ?)`); // dmg shown in log only
	const moveChoice = await chooseFromList(rl, `Choose move for ${combat.entityName[casterIdx]}`, moveLabels);
	const moveIndex = moveIndices[moveChoice];

	// choose target among alive opponents
	const targets = combat.entityName
		.map((name, idx) => ({ name, idx }))
		.filter(ent => ent.idx !== casterIdx && combat.isAlive[ent.idx]);
	const targetChoice = await chooseFromList(rl, 'Choose target', targets.map(t => `${t.idx}: ${t.name}`));
	const target = targets[targetChoice].idx;

	return { moveIndex, target };
}

async function castMove (combat, moveIndex, caster, target) {
	const moveMeta = {
		name:				combat.moveName[moveIndex],
		element:		combat.moveElement[moveIndex],
		iterations: combat.moveIterations[moveIndex],
		operations: combat.moveOperations[moveIndex],
	};
	const resolvedOps = resolveOps(moveMeta, caster, target);
	const result = executeOperations(combat, moveIndex, caster, [target], resolvedOps);
	return result;
}

async function main () {
	const rl = readline.createInterface({ input, output });

	const player = {
		name:			'Player',
		maxHp:		20,
		hp:				20,
		maxEnergy:6,
		energy:		0,
		moves: {
			active: [
				basicWaterAttack
			],
			banked: [	
			]
		},
	};
	const enemy = {
		name:			'Enemy',
		maxHp:		18,
		hp:				18,
		maxEnergy:4,
		energy:		0,
		moves: {
			active: [
				basicFireAttack
			],
			banked: [
			]
		},
	};

	const combat = createCombatState(player, [enemy]);

	console.log('Combat start.');

	while (!combat.gameover) {
		logState(combat);

		// Player turn
		const playerChoice = await chooseMoveAndTarget(rl, combat, 0);
		const playerResult = await castMove(combat, playerChoice.moveIndex, 0, playerChoice.target);
		console.log(`Player cast ${combat.moveName[playerChoice.moveIndex]} on ${combat.entityName[playerChoice.target]} (break: ${playerResult.break})`);
		if (combat.gameover) break;

		// Enemy turn (you pick)
		const enemyChoice = await chooseMoveAndTarget(rl, combat, 1);
		const enemyResult = await castMove(combat, enemyChoice.moveIndex, 1, enemyChoice.target);
		console.log(`Enemy cast ${combat.moveName[enemyChoice.moveIndex]} on ${combat.entityName[enemyChoice.target]} (break: ${enemyResult.break})`);
		if (combat.gameover) break;
	}

	console.log('Combat ended.');
	logState(combat);
	rl.close();
}

main().catch(err => {
	console.error(err);
	process.exit(1);
});
