// engine/templates/move_template.js
// Minimal example move template for a basic water attack.

export const waterUtilityMove = {
	id: 'basic_water_utility',
	name: 'Basic Water Utility',
	description: '',
	type: 'utility',
	element: 'water',
	speed: 'normal',
	iterations: 1,
	initialCooldown: 0,
	initsPublic: false, // Almost No Move Ever Inits Public
	initsBound: false,
	ignoresStatus: {},
	// Placeholder fragment slot; fragments would override/augment metadata.
	fragment: { id: null, name: null },
	// Targeting metadata is for the UI/selector layer.
	targets: {
		alignment: 'move',
		scope: 'any',
		count: 1,
		mode: 'select'
	},
	operations: [
		{
			code: 'extendCooldown',
			args: {
				turns: 2,
				move: 'selected' // executor will resolve 'selected' to selected move
			},
		},
		{
			code: 'applyCooldown',
			args: {
				turns: 2,
				move: 'self' // executor will resolve 'self' to this move
			}
		}
	]
};

