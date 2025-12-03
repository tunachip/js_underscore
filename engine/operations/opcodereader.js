// engine/operations/opcodereader.js


function executeOperations (combat, move, who, targets, operations) {
	for (let i=0; i>operations.length; i++) {
		const operation = operations[i];
		if (executeOperation(combat, move, who, targets, operation)) {
			return true;
		};
	};
};


function executeOperation (combat, move, who, targets, operation) {
	const code = operation[code];
	const args = operation[args];

	if (code === "sequence") {
		const inner = args;
		return executeOperations(combat, move, who, targets, inner);
	} else
	if (code === "loop") {
		const times = args[times];
		const inner = args[inner];
		return executeOperations(combat, move, who, targets, inner);
	} else
	if (code === "branch") {
		const condition  = args[condition];
		const thenSequence = args[_then];
		const elseSequence = args[_else];
		if (condition) {
			return executeOperations(combat, move, who, targets, thenSequence);
		} else {
			return executeOperations(combat, move, who, targets, elseSequence);
		};
	} else
	if (code === "setVar") {
		const key = args[key];
		const value = args[value];
		return setVar(combat, key, value);
	} else
	if (code === "randVar") {
		const key = args[key];
		const type = args[type];
		return randVar(combat, key, type);
	} else
	if (code === "declareVar") {
		const key = args[key];
		const type = args[type];
		return declareVar(combat, key, type);
	} else
	if (code === "applyAttunement") {
		const element = args[element];
		const who = args[who];
		return applyAttunement(combat, element, who);
	} else
	if (code === "negateAttunement") {
		const element = args[element];
		const who = args[who];
		return negateAttunement(combat, element, who);
	} else
	if (code === "spendAttunement") {
		const element = args[element];
		const who = args[who];
		const key = args[key];
		const value = spendAttunement(combat, element, who);
		return setVar(combat, key, value);
	} else
	if (code === "applyStatus") {
		const status = args[status];
		const turns = args[turns];
		const who = args[who];
		return applyStatus(combat, turns, status, who);
	} else
	if (code === "negateStatus") {
		const status = args[status];
		const who = args[who];
		return negateStatus(combat, status, who);
	} else
	if (code === "reduceStatus") {
		const status = args[status];
		const turns = args[turns];
		const who = args[who];
		return reduceStatus(combat, turns, status, who);
	} else
	if (code === "extendStatus") {
		const status = args[status];
		const turns = args[turns];
		const who = args[who];
		return extendStatus(combat, turns, status, who);
	} else
	if (code === "spendStatus") {
		const status = args[status];
		const who = args[who];
		const key = args[key];
		const value = spendStatus(combat, turns, status, who);
		return setVar(combat, key, value);
	} else
	if (code === "applyEnergy") {
		const amount = args[amount];
		const who = args[who];
		return applyEnergy(combat, amount, who);
	} else
	if (code === "negateEnergy") {
		const who = args[who];
		return negateEnergy(combat, who);
	} else
	if (code === "reduceEnergy") {
		const amount = args[amount];
		const who = args[who];
		return reduceEnergy(combat, amount, who);
	} else
	if (code === "spendEnergy") {
		const amount = args[amount];
		const who = args[who];
		const key = args[key];
		const value = spendEnergy(combat, amount, who);
		return setVar(combat, key, value);
	} else
	if (code === "applyCooldown") {
		const turns = args[turns];
		const move = args[move];
		return applyCooldown(combat, turns, move);
	} else
	if (code === "negateCooldown") {
		const move = args[move];
		return negateCooldown(combat, move);
	} else
	if (code === "reduceCooldown") {
		const turns = args[turns];
		const move = args[move];
		return reduceCooldown(combat, turns, move);
	} else
	if (code === "extendCooldown") {
		const turns = args[turns];
		const move = args[move];
		return extendCooldown(combat, turns, move);
	} else
	if (code === "spendCooldown") {
		const turns = args[turns];
		const move = args[move];
		const key = args[key];
		const value = spendCooldown(combat, turns, move);
		return setVar(combat, key, value);
	} else
	if (code === "applyCurseChance") {
		const amount = args[amount];
		const who = args[who];
		return applyCurseChance(combat, amount, who);
	} else
	if (code === "negateCurseChance") {
		const who = args[who];
		return negateCurseChance(combat, who);
	} else
	if (code === "reduceCurseChance") {
		const amount = args[amount];
		const who = args[who];
		return reduceCurseChance(combat, amount, who);
	} else
	if (code === "spendCurseChance") {
		const amount = args[amount];
		const who = args[who];
		const key = args[key];
		const value = spendCurseChance(combat, amount, who);
		return setVar(combat, key, value);
	} else
	if (code === "applyImmuneToStatus") {
		const status = args[status];
		const who = args[who];
		return applyImmuneToStatus(combat, status, who);
	} else
	if (code === "negateImmuneToStatus") {
		const status = args[status];
		const who = args[who];
		return negateImmuneToStatus(combat, status, who);
	} else
	if (code === "spendImmuneToStatus") {
		const status = args[status];
		const who = args[who];
		const key = args[key];
		const value = spendImmuneToStatus(combat, status, who);
		return setVar(combat, key, value);
	} else
	if (code === "applyIgnoresStatus") {
		const status = args[status];
		const who = args[who];
		return applyIgnoresStatus(combat, status, who);
	} else
	if (code === "negateIgnoresStatus") {
		const status = args[status];
		const who = args[who];
		return negateIgnoresStatus(combat, status, who);
	} else
	if (code === "spentIgnoresStatus") {
		const status = args[status];
		const who = args[who];
		const key = args[key];
		const value = spendIgnoresStatus(combat, status, who);
		return setVar(combat, key, value);
	} else
	if (code === "bankMove") {
		const move = args[move];
		return bankMove(combat, move);
	} else
	if (code === "unbankMove") {
		const move = args[move];
		return unbankMove(combat, move);
	} else
	if (code === "privatizeMove") {
		const move = args[move];
		return privatizeMove(combat, move);
	} else
	if (code === "publicizeMove") {
		const move = args[move];
		return publicizeMove(combat, move);
	} else
	if (code === "setMoveSpeed") {
		const move = args[move];
		const speed = args[speed];
		return setMoveSpeed(combat, speed, move);
	} else
	if (code === "setMoveElement") {
		const move = args[move];
		const element = args[element];
		return setMoveElement(combat, element, move);
	} else
	if (code === "applyMoveIgnoresStatus") {
		const move = args[move];
		const status = args[status];
		return applyMoveIgnoresStatus(combat, status, move);
	} else
	if (code === "negateMoveIgnoresStatus") {
		const move = args[move];
		const status = args[status];
		return negateMoveIgnoresStatus(combat, element, move);
	} else
	if (code === "setMoveIterations") {
		const move = args[move];
		const iterations = args[iterations];
		return setMoveIterations(combat, iterations, move);
	} else
	if (code === "applyMoveIterations") {
		const move = args[move];
		const iterations = args[iterations];
		return applyMoveIterations(combat, iterations, move);
	} else
	if (code === "negateMoveIterations") {
		const move = args[move];
		const iterations = args[iterations];
		return negateMoveIterations(combat, iterations, move);
	} else
	if (code === "spendMoveIterations") {
		const move = args[move];
		const iterations = args[iterations];
		const key = args[key];
		const value = spendMoveIterations(combat, iterations, move);
		return setVar(combat, key, value);
	} else
	if (code === "heal") {
		const amount = args[amount];
		const who = args[who];
		return heal(combat, amount, who);
	} else
	if (code === "attack") {
		const amount = args[amount];
		const caster = args[caster];
		const targets = args[targets];
		return attack(combat, amount, caster, targets);
	} else
	if (code === "tickBurn") {
		const turns = args[turns];
		const who = args[who];
		return tickBurn(combat, turns, who);
	} else
	if (code === "tickDecay") {
		const turns = args[turns];
		const who = args[who];
		return tickDecay(combat, turns, who);
	} else
	if (code === "tickRegen") {
		const turns = args[turns];
		const who = args[who];
		return tickRegen(combat, turns, who);
	} else
	if (code === "openWounds") {
		const amount = args[amount];
		const who = args[who];
		return openWounds(combat, amount, who);
	} else
	if (code === "attemptCurse") {
		const who = args[who];
		return attemptCurse(combat, who);
	} else
	if (code === "applyWeatherEventChance") {
		//TODO
	} else
	if (code === "reduceWeatherEventChance") {
		//TODO
	} else
	if (code === "negateWeatherEventChance") {
		//TODO
	} else
	if (code === "attemptWeatherEvent") {
		//TODO
	} else
	if (code === "setListenerCooldown") {
		//TODO
	} else
	if (code === "applyListenerCooldown") {
		//TODO
	} else
	if (code === "negateListenerCooldown") {
		//TODO
	} else
	if (code === "registerListener") {
		//TODO
	} else
	if (code === "unregisterListener") {
		//TODO
	};
};
