// src/engine/combat/getters.js


export function currentAlive (combat) {
	const out = [];
	for (entity of combat.isAlive) {
		if (entity) {
			out.push(entity);
		};
	};
	return out;
};

export function turnOrder (combat, hasPriority) {
	const speeds = combat.speed;
	const n = speeds.length;
	return [...speeds.keys()].sort((a,b) => {
		if (speeds[b] !== speeds[a]) {
			return speeds[b] - speeds[a];
		};
		const distanceA = (a - hasPriority + n) % n;
		const distanceB = (b - hasPriority + n) % n;
		return distanceA - distanceB;
	});
};

