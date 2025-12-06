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
	targets: {
		alignment: 'entity', // picks from entities
		scope: 'enemy', // scope is limited to only enemies
		count: 1,
		mode: 'select' // player selects from items in the scope
	},
	operations: [
		{
			code: 'applyAttunement',
			args: {
				element: 'meta', // resolves to 'element' metadata value
				who: 'caster', // resolves to caster of the move on execution
			},
		},
		{
			code: 'loop',
			args: {
				times: 'meta', // resolves to 'iterations' metadata value
				inner: [
					{
						code: 'attack',
						args: {
							amount: 2,
							caster: 'caster',
							targets: ['targets'], // resolves to targets
						},
					},
				]
			}
		}
	]
};

