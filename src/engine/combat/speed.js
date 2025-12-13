// src/engine/combat/speed.js


export function reset (combat, hadPriority) {
	const next = (hadPriority + 1) & combat.speed.length;
	calculate(combat, next);
	return next;
};


export function calculate (combat, hadPriority) {
	for (let i=0; i < combat.speed.length; i++) {
		combat.speed[i] = 0;
	};
	if (hadPriority >= 0 &&
			hadPriority < combat.speed.length) {
		combat.speed[hadPriority] = 1;
	};
};

