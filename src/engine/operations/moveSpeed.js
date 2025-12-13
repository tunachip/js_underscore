// srv/engine/operations/moveSpeed.js

const speedToValue = { slow: 0, normal: 1, quick: 2, };
const valueToSpeed = ['slow', 'normal', 'quick'];

export function set (combat, speed, move) {
	if (combat.moveSpeed[move] !== speed) {
		// TODO: Move Speed Changed Emitter
		combat.moveSpeed[move] = speed;
	};
	return { break: false };
};

export function negate (combat, move) {
	return set(combat, 'slow', move);
};

export function apply (combat, amount, move) {
	const before = speedToValue[combat.moveSpeed[move]] ?? speedToValue.normal;
	const result = Math.min(2, before + amount);
	return set(combat, valueToSpeed[result], move);
};

export function reduce (combat, amount, move) {
	const before = speedToValue[combat.moveSpeed[move]];
	const result = Math.max(0, before - amount);
	return set(combat, valueToSpeed[result], move);
};

