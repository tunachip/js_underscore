// engine/operations/opcodereader.js

import { applyAttunement, negateAttunement, spendAttunement, } from './operations/attunement_ops.js';
import { bankMove, unbankMove, privatizeMove, publicizeMove, setMoveSpeed, setMoveElement, applyMoveIgnoresStatus, negateMoveIgnoresStatus, setMoveIterations, applyMoveIterations, reduceMoveIterations, negateMoveIterations, spendMoveIterations, } from './operations/change_move_ops.js';
import { applyCooldown, negateCooldown, reduceCooldown, extendCooldown, spendCooldown, } from './operations/cooldown_ops.js';
import { applyCurseChance, negateCurseChance, reduceCurseChance, spendCurseChance, } from './operations/curse_chance_ops.js';
import { heal, attack, } from './operations/damage_ops.js';
import { applyEnergy, negateEnergy, reduceEnergy, spendEnergy, } from './operations/energy_ops.js';
import { applyIgnoresStatus, negateIgnoresStatus, spendIgnoresStatus, } from './operations/ignores_ops.js';
import { applyImmuneToStatus, negateImmuneToStatus, spendImmuneToStatus, } from './operations/immunity_ops.js';
import { openWounds, attemptCurse, } from './operations/special_event_ops.js';
import { applyStatus, negateStatus, reduceStatus, extendStatus, spendStatus, } from './operations/status_ops.js';
import { setVar, randVar, declareVar, } from './operations/var_setter_ops.js';
import { tickRegen, tickBurn, tickDecay, } from './operations/status_tickers.js';


export function executeOperations (combat, move, who, targets, operations) {
	for (const operation of operations) {
		console.log('\x1b[32m' + JSON.stringify(operation, null, 2) + '\x1b[0m');
		const results = executeOperation(combat, move, who, targets, operation);
		if (results.break) {
				return results
		}
	}
	return { break: false };
}

export function executeOperation (combat, move, who, targets, operation) {
	const code = operation['code'];
	const args = operation['args'];

	switch (code) {

		case 'sequence': {
			const inner = args['inner'];
			console.log(' [Sequence] ');
			const results = executeOperations(combat, move, who, targets, inner);
			if (results.break) { return results; }
			return { break: false };
		}
	
		case 'loop': {
			const times = args['times'];
			const inner = args['inner'];
			console.log(' [Loop] (' + times + ')');
			//for (let i=0; i<times; i++) {
			for (_ of times) {
				const results = executeOperations(combat, move, who, targets, inner);
				if (results.break) { return results; }
			}
			return { break: false };
		}
	
		case 'branch': {
			const condition  = args['condition'];
			const thenSequence = args['_then'];
			const elseSequence = args['_else'];
			let results = { break: false };
			console.log(' [Branch] ');
			console.log('Checking conditioons...');
			if (condition) {
				// TODO: checkCondition function
				console.log('Condition is True.');
				results = executeOperations(combat, move, who, targets, thenSequence);
			} else {
				console.log('Condition is False.');
				results = executeOperations(combat, move, who, targets, elseSequence);
			}
			if (results.break) { return results; }
			return { break: false };
		}
	
		case 'setVar': {
			const key = args['key'];
			const value = args['value'];
			const secret = args['secret'];
			console.log('Variable "' + key + '" set to value "' + value + '".');
			return setVar(combat, key, value, secret);
		}
	
		case 'randVar': {
			const key = args['key'];
			const type = args['type'];
			const secret = args['secret'];
			console.log('Creating a Random Variable of type "' + type + '"...');
			return randVar(combat, key, type, secret);
		}
	
		case 'declareVar': {
			const key = args['key'];
			const type = args['type'];
			const secret = args['secret'];
			console.log('Caster is Declaring a Variable of type "' + type + '"...');
			return declareVar(combat, key, type, secret);
		}
	
		case 'applyAttunement': {
			const element = args['element'];
			const who = args['who'];
			console.log('"' + combat.entityName[who] + '" is Attuning to the Element "' + element + '".');
			return applyAttunement(combat, element, who);
		}
	
		case 'negateAttunement': {
			const element = args['element'];
			const who = args['who'];
			console.log('"' + combat.entityName[who] + '" is Losing Attunement to the Element "' + element + '".');
			return negateAttunement(combat, element, who);
		}
	
		case 'spendAttunement': {
			const element = args['element'];
			const who = args['who'];
			console.log('"' + combat.entityName[who] + '" is Spending their Attunement to the Element "' + element + '"...');
			const results = spendAttunement(combat, element, who);
			const key = args['key'];
			const secret = args['secret'];
			const value = results.spent;
			return setVar(combat, key, value, secret);
		}
	
		case 'applyStatus': {
			const status = args['status'];
			const turns = args['turns'];
			const who = args['who'];
			console.log('"' + combat.entityName[who] + '" is Gaining ' + turns + ' turns of the Status "' + status + '".');
			return applyStatus(combat, turns, status, who);
		}
		
		case 'negateStatus': {
			const status = args['status'];
			const who = args['who'];
			console.log('"' + combat.entityName[who] + '" is Losing ' + turns + ' turns of the Status "' + status + '".');
			return negateStatus(combat, status, who);
		}
		
		case 'reduceStatus': {
			const status = args['status'];
			const turns = args['turns'];
			const who = args['who'];
			console.log('"' + combat.entityName[who] + '" is Spending ' + turns + ' turns of the Status "' + status + '".');
			return reduceStatus(combat, turns, status, who);
		}
	
		case 'extendStatus': {
			const status = args['status'];
			const turns = args['turns'];
			const who = args['who'];
			console.log('"' + combat.entityName[who] + '" is Extending ' + turns + ' turns of the Status "' + status + '".');
			return extendStatus(combat, turns, status, who);
		}
	
		case 'spendStatus': {
			const turns = args['turns'];
			const status = args['status'];
			const who = args['who'];
			console.log('"' + combat.entityName[who] + '" is Spending ' + turns + ' turns of the Status "' + status + '".');
			const results = spendStatus(combat, turns, status, who);
			const key = args['key'];
			const secret = args['secret'];
			const value = results.spent;
			return setVar(combat, key, value, secret);
		}
	
		case 'applyEnergy': {
			const amount = args['amount'];
			const who = args['who'];
			console.log('"' + combat.entityName[who] + '" is Gaining ' + amount + ' Energy.');
			return applyEnergy(combat, amount, who);
		}
	
		case 'negateEnergy': {
			const who = args['who'];
			console.log('"' + combat.entityName[who] + '" is losing Energy.');
			return negateEnergy(combat, who);
		}
	
		case 'reduceEnergy': {
			const amount = args['amount'];
			const who = args['who'];
			console.log('"' + combat.entityName[who] + '" is Losing ' + amount + ' Energy.');
			return reduceEnergy(combat, amount, who);
		}
	
		case 'spendEnergy': {
			const amount = args['amount'];
			const who = args['who'];
			console.log('"' + combat.entityName[who] + '" is Spending ' + amount + ' Energy...');
			const results = spendEnergy(combat, amount, who);
			const key = args['key'];
			const secret = args['secret'];
			const value = results.spent;
			return setVar(combat, key, value, secret);
		}
	
		case 'applyCooldown': {
			const turns = args['turns'];
			const move = args['move'];
			console.log('"' + combat.moveName[move] + '" is being put on Cooldown for ' + turns + ' Turns.');
			return applyCooldown(combat, turns, move);
		}
	
		case 'negateCooldown': {
			const move = args['move'];
			console.log('"' + combat.moveName[move] + '" is being taken off of Cooldown.');
			return negateCooldown(combat, move);
		}
	
		case 'reduceCooldown': {
			const turns = args['turns'];
			const move = args['move'];
			console.log('"' + combat.moveName[move] + '" is losing ' + turns + ' turns of Cooldown.');
			return reduceCooldown(combat, turns, move);
		}
	
		case 'extendCooldown': {
			const turns = args['turns'];
			const move = args['move'];
			console.log('"' + combat.moveName[move] + '" is gaining ' + turns + ' additional turns of Cooldown.');
			return extendCooldown(combat, turns, move);
		}
	
		case 'spendCooldown': {
			const turns = args['turns'];
			const move = args['move'];
			console.log('"' + combat.moveName[move] + '" is spending ' + turns + 'Turns of Cooldown...');
			const results = spendCooldown(combat, turns, move);
			const key = args['key'];
			const secret = args['secret'];
			const value = results.spent;
			return setVar(combat, key, value, secret);
		}
	
		case 'applyCurseChance': {
			const amount = args['amount'];
			const who = args['who'];
			console.log('"' + combat.name[who] + '" is Gaining ' + amount + ' Curse Risk.');
			return applyCurseChance(combat, amount, who);
		}
	
		case 'negateCurseChance': {
			const who = args['who'];
			console.log('"' + combat.name[who] + '" is Losing all Curse Risk.');
			return negateCurseChance(combat, who);
		}
	
		case 'reduceCurseChance': {
			const amount = args['amount'];
			const who = args['who'];
			console.log('"' + combat.name[who] + '" is Losing ' + amount + ' Curse Risk.');
			return reduceCurseChance(combat, amount, who);
		}
	
		case 'spendCurseChance': {
			const amount = args['amount'];
			const who = args['who'];
			console.log('"' + combat.name[who] + '" is Spending ' + amount + ' Curse Risk.');
			const results = spendCurseChance(combat, amount, who);
			const key = args['key'];
			const secret = args['secret'];
			const value = results.spent;
			return setVar(combat, key, value, secret);
		}
	
		case 'applyImmuneToStatus': {
			const status = args['status'];
			const who = args['who'];
			console.log('"' + combat.name[who] + '" is Gaining Immunity to Status "' + status + '".');
			return applyImmuneToStatus(combat, status, who);
		}
	
		case 'negateImmuneToStatus': {
			const status = args['status'];
			const who = args['who'];
			console.log('"' + combat.name[who] + '" is Losing Immunity to Status "' + status + '".');
			return negateImmuneToStatus(combat, status, who);
		}
	
		case 'spendImmuneToStatus': {
			const status = args['status'];
			const who = args['who'];
			console.log('"' + combat.name[who] + '" is Spending Immunity to Status "' + status + '".');
			const results = spendImmuneToStatus(combat, status, who);
			const key = args['key'];
			const secret = args['secret'];
			const value = results.spent;
			return setVar(combat, key, value, secret);
		}
	
		case 'applyIgnoresStatus': {
			const status = args['status'];
			const who = args['who'];
			console.log('"' + combat.name[who] + '" is Gaining Ignorance to Status "' + status + '".');
			return applyIgnoresStatus(combat, status, who);
		}
	
		case 'negateIgnoresStatus': {
			const status = args['status'];
			const who = args['who'];
			console.log('"' + combat.name[who] + '" is Losing Ignorance to Status "' + status + '".');
			return negateIgnoresStatus(combat, status, who);
		}
	
		case 'spendIgnoresStatus': {
			const status = args['status'];
			const who = args['who'];
			console.log('"' + combat.name[who] + '" is Spending Ignorance to Status "' + status + '".');
			const results = spendIgnoresStatus(combat, status, who);
			const key = args['key'];
			const secret = args['secret'];
			const value = results.spent;
			return setVar(combat, key, value, secret);
		}
	
		case 'bankMove': {
			const move = args['move'];
			console.log('Move "' + combat.moveName[move] + '" is being pushed to the Banked Zone.');
			return bankMove(combat, move);
		}
	
		case 'unbankMove': {
			const move = args['move'];
			console.log('Move "' + combat.moveName[move] + '" is being pulled to the Active Zone.');
			return unbankMove(combat, move);
		}
	
		case 'privatizeMove': {
			const move = args['move'];
			console.log('Move "' + combat.moveName[move] + '" is being set to Private.');
			return privatizeMove(combat, move);
		}
	
		case 'publicizeMove': {
			const move = args['move'];
			console.log('Move "' + combat.moveName[move] + '" is being set to Public.');
			return publicizeMove(combat, move);
		}
	
		case 'setMoveSpeed': {
			const move = args['move'];
			const speed = args['speed'];
			console.log('Move "' + combat.moveName[move] + '" is being set to MoveSpeed "' + speed + '".');
			return setMoveSpeed(combat, speed, move);
		}
	
		case 'setMoveElement': {
			const move = args['move'];
			const element = args['element'];
			console.log('Move "' + combat.moveName[move] + '" is being set to MoveElement "' + element + '".');
			return setMoveElement(combat, element, move);
		}
	
		case 'applyMoveIgnoresStatus': {
			const move = args['move'];
			const status = args['status'];
			console.log('Move "' + combat.moveName[move] + '" is being set to Ignore Status "' + status + '".');
			return applyMoveIgnoresStatus(combat, status, move);
		}
	
		case 'negateMoveIgnoresStatus': {
			const move = args['move'];
			const status = args['status'];
			console.log('Move "' + combat.moveName[move] + '" is being set to Not Ignore Status "' + status + '".');
			return negateMoveIgnoresStatus(combat, status, move);
		}
	
		case 'setMoveIterations': {
			const move = args['move'];
			const iterations = args['iterations'];
			console.log('Move "' + combat.moveName[move] + '" Iterations is being set to ' + iterations + '.');
			return setMoveIterations(combat, iterations, move);
		}
	
		case 'applyMoveIterations': {
			const move = args['move'];
			const iterations = args['iterations'];
			console.log('Move "' + combat.moveName[move] + '" Iterations is being extended by ' + iterations + '.');
			return applyMoveIterations(combat, iterations, move);
		}

		case 'reduceMoveIterations': {
			const move = args['move'];
			const iterations = args['iterations'];
			console.log('Move "' + combat.moveName[move] + '" Iterations is being reduced by ' + iterations + '.');
			return reduceMoveIterations(combat, iterations, move);
		}
	
		case 'negateMoveIterations': {
			const move = args['move'];
			const iterations = args['iterations'];
			console.log('Move "' + combat.moveName[move] + '" Iterations is being set to 0.');
			return negateMoveIterations(combat, iterations, move);
		}
	
		case 'spendMoveIterations': {
			const move = args['move'];
			const iterations = args['iterations'];
			console.log(iterations + ' Turns of Move "' + combat.moveName[move] + '" are being spent.');
			const results = spendMoveIterations(combat, iterations, move);
			const key = args['key'];
			const secret = args['secret'];
			const value = results.spent;
			return setVar(combat, key, value, secret);
		}
	
		case 'heal': {
			const amount = args['amount'];
			const who = args['who'];
			console.log('"' + who + '" is healing for ' + amount + '.');
			return heal(combat, amount, who);
		}
	
		case 'attack': {
			const element = args['element'];
			const damage = args['amount'] ?? args['damage'];
			const caster = args['caster'];
			const targetArg = args['target'] ?? args['targets'];
			const target = Array.isArray(targetArg) ? targetArg[0] : targetArg;
			console.log('"' + combat.entityName[caster] + '" is attacking "' + combat.entityName[target] + '" with ' + damage + ' "' + element + '" Damage.');
			return attack(combat, element, damage, caster, target);
		}
	
		case 'tickBurn': {
			const turns = args['turns'];
			const who = args['who'];
			console.log('"' + combat.entityName[who] + '" is suffering from ' + turns + ' burns...');
			return tickBurn(combat, turns, who);
		}
	
		case 'tickDecay': {
			const turns = args['turns'];
			const who = args['who'];
			console.log('"' + combat.entityName[who] + '" is suffering from ' + turns + ' decay...');
			return tickDecay(combat, turns, who);
		}
	
		case 'tickRegen': {
			const turns = args['turns'];
			const who = args['who'];
			console.log('"' + combat.entityName[who] + '" is Regenerating for ' + turns + ' ...');
			return tickRegen(combat, turns, who);
		}
	
		case 'openWounds': {
			const amount = args['amount'];
			const who = args['who'];
			console.log('"' + combat.entityName[who] + '" is having ' + amount + ' Wounds Opened...');
			return openWounds(combat, amount, who);
		}
	
		case 'attemptCurse': {
			const who = args['who'];
			console.log('An Ancestral Curse is attempting to take over "' + combat.entityName[who] + '".');
			return attemptCurse(combat, who);
		}
	
		case 'applyWeatherEventChance': {
			//TODO
			return { break: false };
		}
	
		case 'reduceWeatherEventChance': {
			//TODO
			return { break: false };
		}
	
		case 'negateWeatherEventChance': {
			//TODO
			return { break: false };
		}
	
		case 'attemptWeatherEvent': {
			//TODO
			return { break: false };
		}
	
		case 'setListenerCooldown': {
			//TODO
			return { break: false };
		}
	
		case 'applyListenerCooldown': {
			//TODO
			return { break: false };
		}
	
		case 'negateListenerCooldown': {
			//TODO
			return { break: false };
		}
	
		case 'registerListener': {
			//TODO
			return { break: false };
		}
	
		case 'unregisterListener': {
			//TODO
			return { break: false };
		}

		default: {
			return { break: false };
		}
	}
}
