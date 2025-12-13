// srv/engine/operations/moveElement.js


export function set (combat, element, move) {
	if (combat.moveElement[move] !== element) {
		// TODO: Move Element Changed Emitter
		combat.moveElement[move] = element;
	};
	return { break: false };
};

