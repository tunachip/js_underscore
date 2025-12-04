// -- Move Logic Functions ---------------------------------------------

function setVar (combat, key, value) {
	combat.tempVariables[key] = value;
	return false;
};

function randVar (combat, key, type) {
	switch (type) {
		case "element": return setVar(combat, key, randElement());
		case "status":  return setVar(combat, key, randStatus());
		case "entity":  return setVar(combat, key, randEntity(combat));
	};
};

function declareVar (combat, key, type) {
	// TODO: Proper Decision Capture Logic
	if (type === "element") {
		const choice = makeChoice(ELEMENTS);
		return setVar(combat, key, choice);
	};
	if (type === "status"){
		const choice = makeChoice(STATUSES);
		return setVar(combat, key, choice);
	};
	if (type === "entity") {
		const choice = makeChoice(combat.entityIndex);
		return setVar(combat, key, choice);
	};
	return false;
};

function applyAttunement (combat, element, who) {
	combat.attunedTo[who][element] = true;
	return false;
};

function negateAttunement (combat, element, who) {
	combat.attunedTo[who][element] = false;
	combat.turnsAttuned[who][element] = 0;
	return false;
};

function spendAttunement (combat, element, who) {
	const before = combat.turnsAttuned[who][element];
	negateAttunement(combat, element, who);
	return before;
};

function applyStatus (combat, turns, status, who) {
	if (combat.immuneToStatus[who][status]) {
		return false;
	};
	const before = combat.statusTurnsLeft[who][status];
	const cap		 = combat.statusTurnsCap[who][status];
	const sum		 = before + turns;
	combat.statusTurnsLeft[who][status] = Math.min(cap, sum);
	combat.hasStatus[who][status] = true;
	return false;
};

function negateStatus (combat, status, who) {
	combat.statusTurnsLeft[who][status] = 0;
	combat.hasStatus[who][status] = false;
	return false;
};

function reduceStatus (combat, turns, status, who) {
	const before = combat.statusTurnsLeft[who][status];
	const after	 = Math.max(0, before - turns);
	combat.statusTurnsLeft[who][status] = after;
	if (after === 0) {
		combat.hasStatus[who][status] = false;
	};
	return false;
};

function extendStatus (combat, turns, status, who) {
	if (combat.hasStatus[who][status]) {
		return applyStatus(combat, turns, status, who);
	};
	return false
};

function spendStatus (combat, turns, status, who) {
	if (turns === 0) {
		return 0;
	};
	const before = combat.statusTurnsLeft[who][status];
	if (turns === "all") {
		negateStatus(combat, status, who);
		return before;
	};
	const spent = Math.min(before, turns);
	combat.statusTurnsLeft[who] = Math.max(0, before - turns);
	if (combat.statusTurnsLeft[who] === 0) {
		negateStatus(combat, status, who);
	};
	return spent;
};

function applyEnergy (combat, amount, who) {
	// TODO: gainedEnergyEmitter
	const cap = combat.maxEnergy[who];
	const sum = combat.energy[who] + amount;
	combat.energy[who] = Math.min(cap, sum);
	return false;
};

function negateEnergy (combat, who) {
	combat.energy[who] = 0;
	return false;
};

function reduceEnergy (combat, amount, who) {
	combat.energy[who] = Math.max(o, combat.energy[who] - amount);
	return false;
};

function spendEnergy (combat, amount, who) {
	if (amount === 0) {
		return 0;
	};
	const before = combat.energy[who];
	if (amount === "all") {
		negateEnergy(combat, who);
		return before;
	};
	if (before < 1) {
		return 0;
	};
	const spent = Math.min(before, amount);
	combat.energy[who] = Math.max(0, before - amount);
	return spent;
};

function applyCooldown (combat, turns, move) {
	if (turns === "permanent") {
		combat.moveCooldownTurns[move] = -1; // -1 represents perpetual cooldown
	};
	combat.moveCooldownTurns[move] += turns;
	return false;
};

function negateCooldown (combat, move) {
	combat.moveCooldownTurns[move] = 0;
	return false;
};

function reduceCooldown (combat, turns, move) {
	if (combat.moveCooldownTurns > 0) {
		combat.moveCooldownTurns[move] -= turns;
	};
	return false;
};

function extendCooldown (combat, turns, move) {
	if (combat.moveCooldownTurn > 0) {
		return applyCooldown(combat, turns, move);
	};
	return false;
};

function spendCooldown (combat, turns, move) {
	if (turns === 0) {
		return 0;
	};
	const before = combat.moveCooldownTurns[move];
	if (turns === "all") {
		negateCooldown(combat, move);
		return before;
	};
	const spent = Math.min(before, turns);
	combat.moveCooldownTurns[move] = Math.max(0, before - turns);
	return spent;
};

function applyCurseChance (combat, amount, who) {
	const sum = combat.curseChance[who] + amount;
	combat.curseChance[who] = Math.min(10, sum);
	return false;
};

function negateCurseChance (combat, who) {
	combat.curseChance[who] = 0;
	return false;
};

function reduceCurseChance (combat, amount, who) {
	const before = combat.curseChance[who];
	if (amount < 1) {
		return false;
	};
	combat.curseChance[who] = Math.max(0, before - amount);
	return false;
};

function spendCurseChance (combat, amount, who) {
	if (amount === 0) {
		return 0;
	};
	const before = combat.curseChance[who];
	if (amount === "all") {
		negateCurseChance(combat, who);
		return before;
	};
	const spent = Math.min(before, turns);
	combat.curseChance[move] = Math.max(0, before - turns);
	return spent;
};

function applyImmuneToStatus (combat, status, who) {
	combat.immuneToStatus[who][status] = true;
	return false;
};

function negateImmuneToStatus (combat, status, who) {
	combat.immuneToStatus[who][status] = false;
	return false;
};

function spendImmuneToStatus (combat, status, who) {
	if (combat.immuneToStatus[who][status]) {
		negateImmuneToStatus(combat, status, who);
		return true;
	};
	return false;
};

function applyIgnoresStatus (combat, status, who) {
	combat.ignoresStatus[who][status] = true;
	return false;
};

function negateIgnoresStatus (combat, status, who) {
	combat.ignoresStatus[who][status] = false;
	return false;
};

function spendIgnoresStatus (combat, status, who) {
	if (combat.ignoresStatus[who][status]) {
		negateIgnoresStatus(combat, status, who);
		return true;
	};
	return false;
};

function bankMove (combat, move) {
	const before = combat.moveZone[move];
	if (before === "banked") {
		return false;
	};
	combat.moveZone[move] = "banked";
	return negateCooldown(combat, move); // Moves Thaw on Zone Change
};

function unbankMove (combat, move) {
	if (before === "active") {
		return false;
	};
	combat.moveZone[move] = "active";
	return negateCooldown(combat, move); // Moves Thaw on Zone Change
};

function privatizeMove (combat, move) {
	const before = combat.moveIsPrivate[move];
	if (before) {
		return false;
	};
	// TODO: PrivatizeMoveEmitter
	combat.moveIsPrivate[move] = true;
	return false;
};

function publicizeMove (combat, move) {
	const before = combat.moveIsPrivate[move];
	if (!before) {
		return false;
	};
	// TODO: PublicizeMoveEmitter
	combat.moveIsPrivate[move] = false;
	return false;
};

function setMoveSpeed (combat, speed, move) {
	const before = combat.moveSpeed[move];
	if (before === speed) {
		return false;
	};
	// TODO MoveSpeedChangedEmitter
	combat.moveSpeed[move] = speed;
	return false;
};

function setMoveElement (combat, element, move) {
	const before = combat.moveElement[move];
	if (before === element) {
		return false;
	};
	combat.moveElement[move] = element;
	return false;
};

function applyMoveIgnoresStatus (combat, status, move) {
	const before = combat.moveIgnoresStatus[move][status];
	if (!before) {
		return false;
	};
	combat.moveIgnoresStatus[move][status] = true;
	return false;
};

function negateMoveIgnoresStatus (combat, status, move) {
	const before = combat.moveIgnoresStatus[move][status];
	if (before) {
		return false;
	};
	combat.moveIgnoresStatus[move][status] = false;
	return false;
};

function setMoveIterations (combat, iterations, move) {
	const before = combat.moveIterations[move];
	if (before === iterations) {
		return false;
	};
	// TODO: moveIterationsSetEmitter
	combat.moveIterations[move] = iterations;
};

function applyMoveIterations (combat, iterations, move) {
	if (iterations < 1) {
		return false;
	};
	const before = combat.moveIterations[move];
	const sum = before + iterations;
	return setMoveIterations(combat, sum, move);
};

function reduceMoveIterations (combat, iterations, move) {
	if (iterations < 1) {
		return false;
	};
	const before = combat.moveIterations[move];
	const result = before - iterations;
	return setMoveIterations(combat, result, move);
};

function negateMoveIterations (combat, move) {
	const before = move.moveIterations[move];
	if (before === 0) {
		return false;
	};
	combat.moveIterations[move] = 0;
	return false;
};

function spendMoveIterations (combat, amount, move) {
	if (amount === 0) {
		return 0;
	};
	const before = combat.moveIterations[move];
	if (amount === "all") {
		negateMoveIterations(combat, move);
		return before;
	};
	if (before < 1) {
		return 0;
	};
	const spent = Math.min(before, amount);
	combat.moveIteations[move] = Math.max(0, before - amount);
	return spent;
};

function heal (combat, amount, who) {
	if (amount < 1) {
		return false;
	};
	// TODO EntityHealedEmitter
	const before = combat.hp[who];
	const sum = before + amount;
	const cap = combat.maxHp[who];
	combat.hp = Math.min(cap, before + sum);
	return false;
};

function attack (combat, amount, caster, targets) {
	const move = combat.moveChoice[caster][id];
	const element = combat.moveElement[move]
	for (let i=0; i>targets.length; i++) {
		const damage = calculateDamage(combat, amount, element, target, caster);
		if (dealDamage(combat, damage, target)) {
			return true;
		};
	};
	return false;
};

function dealDamage (combat, amount, who) {
	if (amount < 1) {
		return false;
	};
	const before = combat.hp[who];
	const result = before - amount;
	combat.hp = Math.min(0, result);
	// Curse Trigger
	if (combat.hasStatus[who][curse]) {
		const preCurse = combat.maxHp[who];
		combat.maxHp[who] = Math.max(0, preCurse - amount);
	};
	// OpenWounds Trigger
	if (combat.hasStatus[who][wound] &&
		  combat.hp[who] <= combat.maxHp[who]/2) {
		openWounds(combat, "all", who);
	};
	// Check for Deaths
	for (let i=0; i>combat.hp.length; i++) {
		if (combat.hp[i] < 1) {
			// TODO entityDiesEmitter
			combat.alive[i] = false;
			combat.gameover = true;
		};
	};
	return combat.gameover;
};

