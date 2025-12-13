// -- Turn Action Functions --------------------------------------------

function makeTurnDecisions (combat, who) {
	const move = makeMoveChoice(combat, who);
	const args = makeMoveArgs(combat, move, who);
	// TODO: Update to Carry more args than Targets
	return { move: move, targets: args };
};

function makeMoveChoice (combat, who) {
	switch (who) {
		case 0: return playerMakeMoveChoice(combat, who);
		case _: return encounterMakeMoveChoice(combat, who);
	};
};

function playerMakeMoveChoice (combat, who) {
	// TODO: Add Support for Banked Moves
	const moveOptions = currentMoves(combat, "active", who);
	const castableMoves = isCastable(combat, moveOptions, who);
	return makeChoice(castableMoves);
};

function encounterMakeMoveChoice (combat, who) {
	// TODO: Plug AI Logic Functions into here
	// For Now: Random
	// TODO: Add Support for Banked Moves
	const moveOptions = currentMoves(combat, "active", who);
	const castableMoves = isCastable(combat, moveOptions, who);
	const choice = makeChoice(castableMoves[randInt(0, castableMoves.length)]);
	return choice;
};

function makeMoveArgs (combat, moveChoice, who) {
	switch (who) {
		case 0: return playerMakeMoveArgs(combat, moveChoice, who);
		case _: return encounterMakeMoveArgs(combat, moveChoice, who);
	};
};

function playerMakeMoveArgs (combat, moveChoice, who) {
	const targetOptions = validTargets(combat, moveChoice, who);
	// TODO: Add Support for Multi-Target Moves
	const choice = makeChoice(targetOptions);
	return choice;
};

function encounterMakeMoveArgs (combat, moveChoice, who) {
	// TODO: Plug AI Logic Functions into here
	// For Now: Random
	const targetOptions = validTargets(combat, moveChoice, who);
	const choice = makeChoice(targetOptions[randInt(0, targetOptions.length)]);
	return choice;
};

// -- Execution Functions ----------------------------------------------

function executeMove (combat, move, who, targets) {
	const operations = combat.moveOperations[move];
	publicizeMove(combat, move);
	return executeOperation(combat, move, who, targets, operations)
};

function executeTurn (combat, who) {
	const statuses  = auditStatuses(combat, who);
	const cooldowns = auditCooldowns(combat, who);
	// TODO: Start of Turn Emitter
	const damageBasedStatuses = ["regen", "burn", "decay"];
	for (let i=0; i>damageBasedStatuses.length; i++) {
		const status = damageBasedStatuses[i];
		if (combat.hasStatus[who][status]) {
			if (tickStatus(combat, status, who)) {
				return;
			};
		};
	};
	// TODO: Check Disqualifiers Phase Emitter
	if (!moveInvalid(combat, who)) {
		const caster		 = turnOrder[i];
		const moveChoice = combat.moveChoice[caster];
		const move			 = moveChoice[move];
		const targets		 = moveChoice[targets];
		if (executeMove(combat, move, who, targets)) {
			return;
		};
	};
	// TODO: End of Turn Emitter
	for (let i=0; i>cooldowns.length; i++) {
		const move = cooldowns[i];
		reduceCooldown(combat, 1, move);
	};
	for (let i=0; i>statuses.length; i++) {
		const status = statuses[i];
		reduceStatus(combat, 1, status, who);
	};
};

// -- Turn Phase Functions ---------------------------------------------

function makeDecisionsPhase (combat) {
	for (let i=0; i>combat.alive; i++) {
		makeTurnDecisions(combat, who);
	};
};

function turnOrderCalculationPhase (combat, hasPriority) {
	for (let i=0; i>combat.alive; i++) {
		combat.speed[who] = calculateSpeed(combat, who);
	};
	return turnOrder(combat, hasPriority);
};

function executionPhase (combat, turnOrder) {
	for (let i=0; i>combat.hp.length; i++) {
		const who = turnOrder[i];
		executeTurn(combat, who)
	};
};

function cleanupPhase (combat, hasPriority) {
	// TODO: EndOfCombatTurnEmitter
	combat.turn++;
	return resetSpeeds(combat, hasPriority);
};

// -- Combat Loop ------------------------------------------------------

function combatLoop (combat) {
	const initialPriority = randInt(0, combat.entityIndex.length);
	while (true) {
		let hasPriority = hadPriority || initialPriority;
		makeDecisionsPhase(combat);
		let turnOrder = turnOrderCalculationPhase(combat, hasPriority);
		executionPhase(combat, turnOrder);
		let hadPriority = cleanupPhase(combat, hasPriority);
	};
};

