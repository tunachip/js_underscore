// engine/operations/opcodereader.js


// Imports TODO -- still considering better organizations


function executeOperations (combat, move, who, targets, operations) {
	for (let i=0; i<operations.length; i++) {
		const operation = operations[i];
		const results = executeOperation(combat, move, who, targets, operation);
		if (results.break) {
				return results
		}
	}
}

function executeOperation (combat, move, who, targets, operation) {
	const code = operation['code'];
	const args = operation['args'];

	switch (code) {

		case 'sequence': {
			const inner = args['inner'];
			const results = executeOperations(combat, move, who, targets, inner);
			if (results.break) {
				return results;
			}
		}
	
		case 'loop': {
			const times = args['times'];
			const inner = args['inner'];
			for (let i=0; i<times; i++) {
				const results = executeOperations(combat, move, who, targets, inner);
				if (results.break) {
					return results;
				}
			}
		}
	
		case 'branch': {
			const condition  = args['condition'];
			const thenSequence = args['_then'];
			const elseSequence = args['_else'];
			let results = { break: false };
			if (condition) {
				// TODO: checkCondition function
				results = executeOperations(combat, move, who, targets, thenSequence);
			} else {
				results = executeOperations(combat, move, who, targets, elseSequence);
			}
			if (results.break) {
				return results;
			}
		}
	
		case 'setVar': {
			const key = args['key'];
			const value = args['value'];
			const private = args['private'];
			return setVar(combat, key, value, private);
		}
	
		case 'randVar': {
			const key = args['key'];
			const type = args['type'];
			const private = args['private'];
			return randVar(combat, key, type, private);
		}
	
		case 'declareVar': {
			const key = args['key'];
			const type = args['type'];
			const private = args['private'];
			return declareVar(combat, key, type, private);
		}
	
		case 'applyAttunement': {
			const element = args['element'];
			const who = args['who'];
			return applyAttunement(combat, element, who);
		}
	
		case 'negateAttunement': {
			const element = args['element'];
			const who = args['who'];
			return negateAttunement(combat, element, who);
		}
	
		case 'spendAttunement': {
			const element = args['element'];
			const who = args['who'];
			const key = args['key'];
			const private = args['private'];
			const results = spendAttunement(combat, element, who);
			const value = results.spent;
			return setVar(combat, key, value, private);
		}
	
		case 'applyStatus': {
			const status = args['status'];
			const turns = args['turns'];
			const who = args['who'];
			return applyStatus(combat, turns, status, who);
		}
		
		case 'negateStatus': {
			const status = args['status'];
			const who = args['who'];
			return negateStatus(combat, status, who);
		}
		
		case 'reduceStatus': {
			const status = args['status'];
			const turns = args['turns'];
			const who = args['who'];
			return reduceStatus(combat, turns, status, who);
		}
	
		case 'extendStatus': {
			const status = args['status'];
			const turns = args['turns'];
			const who = args['who'];
			return extendStatus(combat, turns, status, who);
		}
	
		case 'spendStatus': {
			const status = args['status'];
			const who = args['who'];
			const key = args['key'];
			const private = args['private'];
			const results = spendStatus(combat, turns, status, who);
			const value = results.spent;
			return setVar(combat, key, value, private);
		}
	
		case 'applyEnergy': {
			const amount = args['amount'];
			const who = args['who'];
			return applyEnergy(combat, amount, who);
		}
	
		case 'negateEnergy': {
			const who = args['who'];
			return negateEnergy(combat, who);
		}
	
		case 'reduceEnergy': {
			const amount = args['amount'];
			const who = args['who'];
			return reduceEnergy(combat, amount, who);
		}
	
		case 'spendEnergy': {
			const amount = args['amount'];
			const who = args['who'];
			const key = args['key'];
			const private = args['private'];
			const results = spendEnergy(combat, amount, who);
			const value = results.spent;
			return setVar(combat, key, value, private);
		}
	
		case 'applyCooldown': {
			const turns = args['turns'];
			const move = args['move'];
			return applyCooldown(combat, turns, move);
		}
	
		case 'negateCooldown': {
			const move = args['move'];
			return negateCooldown(combat, move);
		}
	
		case 'reduceCooldown': {
			const turns = args['turns'];
			const move = args['move'];
			return reduceCooldown(combat, turns, move);
		}
	
		case 'extendCooldown': {
			const turns = args['turns'];
			const move = args['move'];
			return extendCooldown(combat, turns, move);
		}
	
		case 'spendCooldown': {
			const turns = args['turns'];
			const move = args['move'];
			const key = args['key'];
			const private = args['private'];
			const results = spendCooldown(combat, turns, move);
			const value = results.spent;
			return setVar(combat, key, value, private);
		}
	
		case 'applyCurseChance': {
			const amount = args['amount'];
			const who = args['who'];
			return applyCurseChance(combat, amount, who);
		}
	
		case 'negateCurseChance': {
			const who = args['who'];
			return negateCurseChance(combat, who);
		}
	
		case 'reduceCurseChance': {
			const amount = args['amount'];
			const who = args['who'];
			return reduceCurseChance(combat, amount, who);
		}
	
		case 'spendCurseChance': {
			const amount = args['amount'];
			const who = args['who'];
			const key = args['key'];
			const private = args['private'];
			const results = spendCurseChance(combat, amount, who);
			const value = results.spent;
			return setVar(combat, key, value, private);
		}
	
		case 'applyImmuneToStatus': {
			const status = args['status'];
			const who = args['who'];
			return applyImmuneToStatus(combat, status, who);
		}
	
		case 'negateImmuneToStatus': {
			const status = args['status'];
			const who = args['who'];
			return negateImmuneToStatus(combat, status, who);
		}
	
		case 'spendImmuneToStatus': {
			const status = args['status'];
			const who = args['who'];
			const key = args['key'];
			const private = args['private'];
			const results = spendImmuneToStatus(combat, status, who);
			const value = results.spent;
			return setVar(combat, key, value, private);
		}
	
		case 'applyIgnoresStatus': {
			const status = args['status'];
			const who = args['who'];
			return applyIgnoresStatus(combat, status, who);
		}
	
		case 'negateIgnoresStatus': {
			const status = args['status'];
			const who = args['who'];
			return negateIgnoresStatus(combat, status, who);
		}
	
		case 'spentIgnoresStatus': {
			const status = args['status'];
			const who = args['who'];
			const key = args['key'];
			const private = args['private'];
			const results = spendIgnoresStatus(combat, status, who);
			const value = results.spent;
			return setVar(combat, key, value, private);
		}
	
		case 'bankMove': {
			const move = args['move'];
			return bankMove(combat, move);
		}
	
		case 'unbankMove': {
			const move = args['move'];
			return unbankMove(combat, move);
		}
	
		case 'privatizeMove': {
			const move = args['move'];
			return privatizeMove(combat, move);
		}
	
		case 'publicizeMove': {
			const move = args['move'];
			return publicizeMove(combat, move);
		}
	
		case 'setMoveSpeed': {
			const move = args['move'];
			const speed = args['speed'];
			return setMoveSpeed(combat, speed, move);
		}
	
		case 'setMoveElement': {
			const move = args['move'];
			const element = args['element'];
			return setMoveElement(combat, element, move);
		}
	
		case 'applyMoveIgnoresStatus': {
			const move = args['move'];
			const status = args['status'];
			return applyMoveIgnoresStatus(combat, status, move);
		}
	
		case 'negateMoveIgnoresStatus': {
			const move = args['move'];
			const status = args['status'];
			return negateMoveIgnoresStatus(combat, status, move);
		}
	
		case 'setMoveIterations': {
			const move = args['move'];
			const iterations = args['iterations'];
			return setMoveIterations(combat, iterations, move);
		}
	
		case 'applyMoveIterations': {
			const move = args['move'];
			const iterations = args['iterations'];
			return applyMoveIterations(combat, iterations, move);
		}
	
		case 'negateMoveIterations': {
			const move = args['move'];
			const iterations = args['iterations'];
			return negateMoveIterations(combat, iterations, move);
		}
	
		case 'spendMoveIterations': {
			const move = args['move'];
			const iterations = args['iterations'];
			const key = args['key'];
			const private = args['private'];
			const results = spendMoveIterations(combat, iterations, move);
			const value = results.spent;
			return setVar(combat, key, value, private);
		}
	
		case 'heal': {
			const amount = args['amount'];
			const who = args['who'];
			return heal(combat, amount, who);
		}
	
		case 'attack': {
			const amount = args['amount'];
			const caster = args['caster'];
			const targets = args['targets'];
			return attack(combat, amount, caster, targets);
		}
	
		case 'tickBurn': {
			const turns = args['turns'];
			const who = args['who'];
			return tickBurn(combat, turns, who);
		}
	
		case 'tickDecay': {
			const turns = args['turns'];
			const who = args['who'];
			return tickDecay(combat, turns, who);
		}
	
		case 'tickRegen': {
			const turns = args['turns'];
			const who = args['who'];
			return tickRegen(combat, turns, who);
		}
	
		case 'openWounds': {
			const amount = args['amount'];
			const who = args['who'];
			return openWounds(combat, amount, who);
		}
	
		case 'attemptCurse': {
			const who = args['who'];
			return attemptCurse(combat, who);
		}
	
		case 'applyWeatherEventChance': {
			//TODO
		}
	
		case 'reduceWeatherEventChance': {
			//TODO
		}
	
		case 'negateWeatherEventChance': {
			//TODO
		}
	
		case 'attemptWeatherEvent': {
			//TODO
		}
	
		case 'setListenerCooldown': {
			//TODO
		}
	
		case 'applyListenerCooldown': {
			//TODO
		}
	
		case 'negateListenerCooldown': {
			//TODO
		}
	
		case 'registerListener': {
			//TODO
		}
	
		case 'unregisterListener': {
			//TODO
		}	
	}
}

