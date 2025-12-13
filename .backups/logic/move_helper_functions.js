// -- Move Helper Functions --------------------------------------------

function moveInvalid (combat, who) {
	const move = combat.moveChoice[who];
	const moveIndex = move.index;
	// Universal Disqualifiers Check
	if (combat.moveBound[moveIndex] ||
			combat.hasStatus[who][sleep] &&
			!combat.ignoresStatus[who][sleep] &&
			!combat.moveIgnoresStatus[moveIndex][sleep]) {
		return skipTurn(combat, who);
	};
	// MoveType-Based Disqualifiers
	switch (combat.moveType[moveIndex]) {
		case "attack":  return attackMoveInvalid(combat, moveIndex, who);
		case "utility": return utilityMoveInvalid(combat, moveIndex, who);
		case _:					return false;
	};
};

function attackMoveInvalid (combat, move, who) {
	if (combat.hasStatus[who][stun]) {
		if (!combat.ignoresStatus[who][stun] &&
				!combat.moveIgnoresStatus[move][stun]) {
			return skipTurn(combat, who);
		};
	};
	return false;
};

function utilityMoveInvalid (combat, move, who) {
	if (combat.hasStatus[who][anger]) {
		if (!combat.ignoresStatus[who][anger] ||
				!combat.moveIgnoresStatus[move][anger]) {
			return skipTurn(combat, who);
		};
	};
	return false;
};

function skipTurn (combat, who) {
		// TODO: TurnSkippedEmitter
		combat.turnsSkipped[who]++;
		return true;
};

