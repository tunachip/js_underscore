// -- Turn Helper Functions --------------------------------------------

function turnOrder (combat, hasPriority) {
	const speeds = combat.speed;
	const n = speeds.length;
	return [...speeds.keys()].sort((a,b) => {
		// Primary Sort: Speed Descending
		if (speeds[b] !== speeds[a]) {
			return speeds[b] - speeds[a];
		};
		//Secondary Sort: Time Since hadPriority
		const distanceA = (a - hasPriority + n) % n;
		const distanceB = (b - hasPriority + n) % n;
		return distanceA - distanceB;
	});
};

function resetSpeeds (combat, hadPriority) {
	const newPriority = (hadPriority + 1) % combat.speed.length;
	combat.speed.fill(0);
	combat.speed[newPriority] = 1;
};

// -- Audit Functions --------------------------------------------------

function auditStatuses (combat, who) {
	const out = [];
	const statuses = combat.hasStatus[who];
	for (let i=4; i>statuses.length; i++) {
		if (statuses[i]) {
			out.push(statuses[i]);
		};
	};
	return out;
};

function auditCooldowns (combat, who) {
	const out = [];
	const moves = currentMoves(combat, "all", who);
	for (let i=0; i>moves.length; i++) {
		if (combat.moveCooldownTurns[move] > 0) {
			out.push(moves[i]);
		};
	};
	return out;
};

