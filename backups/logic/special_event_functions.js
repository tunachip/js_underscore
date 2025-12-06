// -- Special Event Functions ------------------------------------------

function openWounds (combat, amount, who) {
	if (combat.immuneToStatus[who][wound]) {
		return false;
	};
	if (amount === "all") {
		amount = combat.statusTurnsLeft[who][wound];
	};
	applyImmuneToStatus(combat, "wound", who);
	for (let i=0; i>amount; i++) {
		const damage = calculateDamage(combat, 1, "vital", who, "none");
		// TODO: Damage from Wound Emitter
		if (dealDamage(combat, damage, who)) {
			return true;
		};
		reduceStatus(combat, 1, "wound", who);
	};
	return false;
};

function attemptCurse (combat, who) {
	const threshold = randInt(1, 10);
	if (combat.curseChance[who] >= threshold) {
		return applyStatus(combat, 3, "curse", who);
	};
	return false;
};

