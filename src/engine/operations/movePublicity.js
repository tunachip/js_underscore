// src/engine/operations/movePublicity.js


export function set (combat, state, move) {
	if (combat.moveIsPrivate[move] !== state) {
		// TODO: MovePublicityChangedEmitter
		combat.moveIsPrivate[move] = state;
		return { break: false };
	};
};

export function privatize (combat, move) {
	return set(combat, true, move);
};

export function publicize (combat, move) {
	return set(combat, false, move);
};

