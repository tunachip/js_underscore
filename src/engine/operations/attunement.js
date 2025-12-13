// src/engine/operations/attunement.js


export function apply (combat, element, who) {
	combat.attunedTo[who][element] = true;
	return { break: false };
};

export function negate (combat, element, who) {
	combat.attunedTo[who][element] = false;
	combat.turnsAttuned[who][element] = 0;
	return { break: false };
};

export function spend (combat, element, who) {
	const before = combat.turnsAttuned[who][element];
	negate(combat, element, who);
	return { break: false, spent: before };
};

