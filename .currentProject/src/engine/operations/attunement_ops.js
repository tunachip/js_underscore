// engine/operations/attunement_ops.js


export function applyAttunement (combat, element, who) {
	combat.attunedTo[who][element] = true;
	return { break: false };
}

export function negateAttunement (combat, element, who) {
	combat.attunedTo[who][element] = false;
	combat.turnsAttuned[who][element] = 0;
	return { break: false };
}

export function spendAttunement (combat, element, who) {
	const before = combat.turnsAttuned[who][element];
	negateAttunement(combat, element, who);
	return { break: false, spent: before };
}

