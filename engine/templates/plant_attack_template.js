// engine/templates/plant_attack_template.js

export const basicPlantMove = {
	id: 'basic_plant_attack',
	name: 'Basic Plant Attack',
	description: 'Attunes Caster to Plant. Deals 2 Plant Damage to Target.',
	type: 'attack',
	element: 'plant',
	speed: 'normal',
	iterations: 1,
	initialCooldown: 0,
	initsPublic: false,
	initsBound: false,
	ignoresStatus: {},
	fragment: {},
	targets: {
		type: 'entity',
		scope: 'enemy',
		count: 1,
		mode: 'select'
	},
	operations: [
		{
			code: 'applyAttunement',
			args: {
				element: 'meta', // resolves to 'element' metadata value
				who: 'caster', // resolves to caster
			},
		},
		{
			code: 'loop',
			args: {
				times: 'meta', // resolves to 'interations' metadata value
				inner: [
					{
						code: 'attack',
						args: {
							amount: 2,
							caster: 'caster',
							targets: ['targets'], // resolves to targets from choice
						},
					},
				]
			}
		}
	]
};

