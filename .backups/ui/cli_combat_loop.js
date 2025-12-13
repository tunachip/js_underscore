// ui/cli_combat_loop.js
// Runs the synchronous combatLoop with text input choices.

import fs from 'node:fs';
import { createCombatState } from '../engine/combatStore.js';
import { combatLoop } from '../engine/combatLoop.js';
import { basicWaterAttack } from '../engine/templates/water_attack_template.js';
import { basicFireAttack } from '../engine/templates/fire_attack_template.js';
import { ELEMENTS } from '../engine/globals/elements.js';
import { STATUSES } from '../engine/globals/statuses.js';

// Provide a minimal synchronous prompt for playerChoice (used inside combatLoop).
if (typeof global.prompt !== 'function') {
	global.prompt = function prompt (question = '> ', defaultValue = '') {
		fs.writeSync(1, question);
		const buf = Buffer.alloc(1024);
		const bytes = fs.readSync(0, buf, 0, 1024, null);
		const input = buf.toString('utf8', 0, bytes);
		if (!input) return defaultValue;
		const trimmed = input.replace(/\r?\n$/, '');
		return trimmed.length ? trimmed : defaultValue;
	};
}

function logState (combat) {
	console.log('\n=== Entities ===');
	const entities = combat.entityName.map((name, idx) => ({
		idx,
		name,
		player: combat.isPlayer[idx],
		hp: `${combat.hp[idx]}/${combat.maxHp[idx]}`,
		energy: `${combat.energy[idx]}/${combat.maxEnergy[idx]}`,
		speed: combat.speed[idx],
		curseChance: combat.curseChance[idx],
		alive: combat.isAlive[idx],
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
}

function main () {
	const player = {
		name: 'Player',
		maxHp: 20,
		hp: 20,
		maxEnergy: 6,
		energy: 0,
		moves: { active: [basicWaterAttack], banked: [] },
	};
	const enemy = {
		name: 'Enemy',
		maxHp: 18,
		hp: 18,
		maxEnergy: 4,
		energy: 0,
		moves: { active: [basicFireAttack], banked: [] },
	};

	const combat = createCombatState(player, [enemy]);

	console.log('Combat start. Follow prompts to choose moves/targets.');
	logState(combat);

	combatLoop(combat);

	console.log('Combat ended.');
	logState(combat);
}

main();
