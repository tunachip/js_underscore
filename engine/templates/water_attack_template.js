// engine/templates/water_attack_template.js

export const basicWaterMove = {
	id: 'basic_water_attack',
	name: 'Basic Water Attack',
	description: 'Attunes Caster to Water. Deals 2 Water Damage to Target.',
	type: 'attack',
	element: 'water',
	speed: 'normal',
	iterations: 1,
	initialCooldown: 0,
	initsPublic: false,
	initsBound: false,
	ignoresStatus: {},
	fragment: {},
	targets: {
		alignment: 'entity',
		scope: 'enemy',
		count: 1,
		mode: 'select'
	},
	operations: [
		{
			code: 'applyAttunement',
			args: {
				element: 'meta',
				who: 'caster',
			},
		},
		{
			code: 'loop',
			args: {
				times: 'meta',
				inner: [
					{
						code: 'attack',
						args: {
							element: 'meta',
							amount: 2,
							caster: 'caster',
							target: 'meta',
						},
					},
				]
			}
		}
	]
};

