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

export function status (combat, turns, status, who) {
	if (!combat.hasStatus[who][status]) {
		return { break: false };
	};
	if (combat.ignoresStatus[who][status]) {
		return Status.reduce(combat, turns, status, who);
	};
	switch (status) {
		case 'regen': { return regen(combat, turns, who); };
		case 'burn':  {	return burn(combat, turns, who); };
		case 'decay': { return decay(combat, turns, who); };
		case 'wound': { return { break: false }; };
		default: {
			return Status.reduce(combat, turns, status, who);
		};
	};
};

