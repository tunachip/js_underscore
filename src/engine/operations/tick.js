// src/engine/operations/tick.js

import { Status, CurseChance, Damage, Event } from '#engine/operations';


export function regen (combat, turns, who) {
	if (combat.attunedTo[who]['fire'])  { turns++; };
	if (combat.attunedTo[who]['vital']) { turns++; };
	Status.reduce(combat, turns, 'regen', who);
	return Event.heal(combat, turns, who);
}

export function burn (combat, turns, who) {
  Status.reduce(combat, turns, 'burn', who);
	const result = Damage.calculate(combat, 'fire', turns, who);
	return Damage.deal(combat, result.damage, who);
}

export function decay (combat, turns, who) {
	Status.reduce(combat, turns, 'decay', who);
	const result = Damage.calculate(combat, 'force', turns, who);
	if (result.damage > 0) {
		CurseChance.apply(combat, turns, who);
	};
	return Damage.deal(combat, result.damage, who);
};

export function status (combat, status, who) {
	if (!combat.hasStatus[who][status]) {
		return { break: false };
	};
	if (combat.ignoresStatus[who][status]) {
		return Status.reduce(combat, 1, status, who);
	};
	switch (status) {
		case 'regen': { return regen(combat, 1, who); };
		case 'burn':  {	return burn(combat, 1, who); };
		case 'decay': { return decay(combat, 1, who); };
		case 'wound': { return { break: false }; };
		default: {
			return Status.reduce(combat, 1, status, who);
		};
	};
};

