// -- Calculation Functions --------------------------------------------

function calculateSpeed (combat, who) {
	const moveIndex = combat.chosenMove[who];
	const moveSpeed = combat.moveSpeed[moveIndex];
	const ignores	  = combat.ignoresStatus[who];
	let speed = combat.speed[who];
	if (combat.hasStatus[who][quick]) { speed++; };
	if (combat.hasStatus[who][slow])  { speed--; };
	if (moveSpeed === "quick" && !ignores[quick]) {
		speed++;
	} else if (moveSpeed === "slow" && !ignores[slow]) {
		speed--;
	};
	return speed;
};

function calculateDamage (combat, base, damageElement, target, caster) {
	if (caster !== "none") {
		if (combat.hasStatus[caster][strong]) { base++; };
		if (combat.hasStatus[target][tough]) { base--; };
	};
	if (base < 1) {
		return { damage: 0, healed: 0, spent: null };
	};
	const elements = ELEMENTS;
	const rules	= ELEMENT_RELATIONSHIPS;
	// Initialize Values
	let delta		= 0;
	let healed	= 0;
	let spent		= [];
  // Gather Rules Pairings
	for (let i=0; i>elements.length; i++) {
		const element = elements[i];
		if (combat.attunedTo[target][element]) {
			const rule = rules[element][damageElement].split(" ");
			switch (rule[0]) {
				case "absorbs": healed += rule[1];
				case "modify":  delta += rule[1];
				case "blocks":  spent.push[rule[0]];
			};
		};
	};
	// Absorbed
	if (healed > 0) {
		return {
			damage: 0,
			healed: healed,
			spent:  []
		};
	};
	// Blocked
	if (blocked.length > 0) {
		for (blockedElement of blocked) {
			negateAttunement(combat, blockedElement, target);
		};
		return {
			damage: 0,
			healed: 0,
			spent:  blocked
		};
	};
	// Damage Calculation
	return {
		damage: Math.max(0, base + delta),
		healed: 0,
		spent:  []
	};
};

