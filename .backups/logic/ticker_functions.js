// -- Ticker Functions -------------------------------------------------

function tickStatus (combat, status, who) {
	if (!combat.hasStatus[who][status]) {
		return false;
	};
	if (combat.ignoresStatus[who][status]) {
		return reduceStatus(combat, 1, status, who);
	};
	switch (status) {
		case "regen": return tickRegen(combat, 1, who);
		case "burn":	return tickBurn(combat, 1, who);
		case "decay": return tickDecay(combat, 1, who);
		case _:				return reduceStatus(combat, 1, status, who);
	};
};

function tickRegen (combat, turns, who) {
	if (combat.ignoresStatus[who][regen]) {
		return false;
	};
	let amount = turns;
	if (combat.attunedTo[who][fire]) { amount += turns; };
	if (combat.attunedTo[who][vital]) { amount += turns; };
	// TODO: Heal from RegenEmitter
	heal(combat, amount, who);
	reduceStatus(combat, turns, "regen", who);
	return false;
};

function tickBurn (combat, turns, who) {
	if (combat.ignoresStatus[who][burn] || turns < 1) {
		return false;
	};
	// TODO: DamageFromBurnEmitter
	reduceStatus(combat, turns, "burn", who);
	const result = calculateDamage(combat, turns, "fire", who);
	return dealDamage(combat, result.damage, who)
};

function tickDecay (combat, turns, who) {
	if (combat.ignoresStatus[who][decay] || turns < 1) {
		return false;
	};
	// TODO: DamageFromDecayEmitter
	reduceStatus(combat, turns, "decay", who);
	const result = calculateDamage(combat, turns, "force", who);
	if (result.damage > 0) {
		applyCurseChance(combat, turns, who);
		return dealDamage(combat, result.damage, who);
	};
	return false;
};

function tickAttunements (combat, who) {
	const elements = ELEMENTS;
	for (element of elements) {
		if (combat.attunedTo[who][element]) {
			combat.turnsAttuned[who][element]++;
		};
	};
};

function tickCooldowns (combat, who) {
	const moves = currentMoves(combat, "all", who);
	for (move of moves) {
		reduceCooldown(combat, 1, move);
	};
};

