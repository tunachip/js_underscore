// src/engine/opcodeReader.js


export function executeOperations (ctx) {
	// Executes all Operations in order, checking for 'break' clause on each OpEscape
	for (const operation of operations) {




		const results = executeOperation(combat, move, who, targets, operation);
		if (results.break) {
				return results;
		};
	};
	return { break: false };
}

export function executeOperation (ctx) {
	//	Step 0:	Collect Needs
	

	//	Step 1:	Check if Operation Args are Cached
	const needed = ctx.needed;
	const requests = [];
	for (need in needed) {
		const currentVal = ctx.args[need];
		if (currentVal === undefined) {
			requests.push(need);
		};
	};

	//	Step 2:	Collect Missing Args
	for (const key in requests) {
		const val = ctx.combat[key];
		ctx.register(key, val);
	}
	//	Step 3:	Execute Operation Logic
	
	switch ()

	//	Step 4:	On Return: List of Changed Vars; Check if Any in Cache
	//	Step 5:	If Cached Values have Changed, Update them from the Return
	//	Step 6: Return bool(Break) to tell Loop if turn is interrupted and why
};







/*		OLD VERSION --- EXISTS FOR ARG REFERENCE ALONE --
export function executeOperation (combat, move, who, targets, operation) {
	const code = operation['code'];
	const args = operation['args'];

	switch (code) {

		case 'sequence': {
			const inner = args['inner'];
			const results = executeOperations(combat, move, who, targets, inner);
			if(results.break) { return results; }
			return { break: false };
		}
	
		case 'loop': {
			const times = args['times'];
			const inner = args['inner'];
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
			if (condition) {
				// TODO: checkCondition function
				results = executeOperations(combat, move, who, targets, thenSequence);
			} else {
				results = executeOperations(combat, move, who, targets, elseSequence);
			}
			if (results.break) { return results; }
			return { break: false };
		}
	
		case 'setVar': {
			const key = args['key'];
			const value = args['value'];
			const secret = args['secret'];
			return setVar(combat, key, value, secret);
		}
	
		case 'randVar': {
			const key = args['key'];
			const type = args['type'];
			const secret = args['secret'];
			return randVar(combat, key, type, secret);
		}
	
		case 'declareVar': {
			const key = args['key'];
			const type = args['type'];
			const secret = args['secret'];
			return declareVar(combat, key, type, secret);
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
			const turns = args['turns'];
			const status = args['status'];
			const who = args['who'];
			const results = spendStatus(combat, turns, status, who);
			const key = args['key'];
			const secret = args['secret'];
			const value = results.spent;
			return setVar(combat, key, value, secret);
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
			const results = spendEnergy(combat, amount, who);
			const key = args['key'];
			const secret = args['secret'];
			const value = results.spent;
			return setVar(combat, key, value, secret);
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
			const results = spendCooldown(combat, turns, move);
			const key = args['key'];
			const secret = args['secret'];
			const value = results.spent;
			return setVar(combat, key, value, secret);
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
			const results = spendCurseChance(combat, amount, who);
			const key = args['key'];
			const secret = args['secret'];
			const value = results.spent;
			return setVar(combat, key, value, secret);
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
			const results = spendImmuneToStatus(combat, status, who);
			const key = args['key'];
			const secret = args['secret'];
			const value = results.spent;
			return setVar(combat, key, value, secret);
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
	
		case 'spendIgnoresStatus': {
			const status = args['status'];
			const who = args['who'];
			const results = spendIgnoresStatus(combat, status, who);
			const key = args['key'];
			const secret = args['secret'];
			const value = results.spent;
			return setVar(combat, key, value, secret);
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

		case 'reduceMoveIterations': {
			const move = args['move'];
			const iterations = args['iterations'];
			return reduceMoveIterations(combat, iterations, move);
		}
	
		case 'negateMoveIterations': {
			const move = args['move'];
			const iterations = args['iterations'];
			return negateMoveIterations(combat, iterations, move);
		}
	
		case 'spendMoveIterations': {
			const move = args['move'];
			const iterations = args['iterations'];
			const results = spendMoveIterations(combat, iterations, move);
			const key = args['key'];
			const secret = args['secret'];
			const value = results.spent;
			return setVar(combat, key, value, secret);
		}
	
		case 'heal': {
			const amount = args['amount'];
			const who = args['who'];
			return heal(combat, amount, who);
		}
	
		case 'attack': {
			const element = args['element'];
			const damage = args['amount'] ?? args['damage'];
			const caster = args['caster'];
			const targetArg = args['target'] ?? args['targets'];
			const target = Array.isArray(targetArg) ? targetArg[0] : targetArg;
			return attack(combat, element, damage, caster, target);
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
	
		case 'applyWeatherEventChance': { return { break: false }; }
		case 'reduceWeatherEventChance': { return { break: false }; }
		case 'negateWeatherEventChance': { return { break: false }; }
		case 'attemptWeatherEvent': { return { break: false }; }
		case 'setListenerCooldown': { return { break: false }; }
		case 'applyListenerCooldown': { return { break: false }; }
		case 'negateListenerCooldown': { return { break: false }; }
		case 'registerListener': { return { break: false }; }
		case 'unregisterListener': { return { break: false }; }
		default: { return { break: false }; }
	}
}
*/
