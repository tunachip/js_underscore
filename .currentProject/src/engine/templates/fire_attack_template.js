// engine/templates/fire_attack_template.js

export const basicFireAttack = {
	id: 'basic_fire_attack',
	name: 'Basic Fire Attack',
	description: 'Attunes Caster to Fire. Deals 2 Fire Damage to Target.',
	type: 'attack',
	element: 'fire',
	speed: 'normal',
	iterations: 1,
	initialCooldown: 0,
	initsPublic: false,
	initsBound: false,
	ignoresStatus: {},
	fragment: {},
	target: {
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

