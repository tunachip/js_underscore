// engine/templates/move_template.js
// Minimal example move template for a basic water attack.

export const fireUtilityMove = {
	id: 'basic_fire_utility',
	name: 'Basic Fire Utility',
	description: 'Target Gains 2 Energy. Applies 1 Burn to Target.',
	type: 'utility',
	element: 'fire',
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
		alignment: 'entity',
		scope: 'any',
		count: 1,
		mode: 'select'
	},
	operations: [
		{
			code: 'applyEnergy',
			args: {
				amount: 2,
				who: 'selected', // executor will resolve "selected" to the selected alignment
			},
		},
		{
			code: 'applyStatus',
			args: {
				status: 'burn',
				turns: 2,
				who: 'selected', // executor will resolve "selected" to the selected alignment
			}
		}
	]
};

