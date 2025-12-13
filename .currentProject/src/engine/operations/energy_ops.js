// engine/operations/energy_ops.js


export function applyEnergy (combat, amount, who) {
	// TODO: gainedEnergyEmitter
	const before = combat.energy[who];
	const cap = combat.maxEnergy[who];
	const sum = before + amount;
	combat.energy[who] = Math.min(cap, sum);
	return { break: false };
}

export function negateEnergy (combat, who) {
	// TODO: energyDepletedEmitter
	combat.energy[who] = 0;
	return { break: false };
}

export function reduceEnergy (combat, amount, who) {
	const before = combat.energy[who];
	if (amount >= before) {
		return negateEnergy(combat, who);
	}
	const after	= Math.max(0, combat.energy[who] - amount);
	combat.energy[who] = after;
	return { break: false };
}

export function spendEnergy (combat, amount, who) {
	const before = combat.energy[who];
	switch (amount) {
		case 0: {
			return { break: false, spent: 0 };
		}
		case 'all': {
			negateEnergy(combat, who);
			return { break: false, spent: before };
		}
		default: {
			reduceEnergy(combat, amount, who);
			const spent = Math.min(before, amount);
			return { break: false, spent: spent };
		}
	}
}

