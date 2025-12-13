// engine/templates/plant_attack_template.js

export const basicPlantAttack = {
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

