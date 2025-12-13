// engine/templates/entitytemplate.js


export const startingBuildTemplates = [
	{
		name: "mason",
		maxHp: 20,
		hp: 20,
		maxEnergy: 6,
		energy: 0,
		moveSlots: { active: 4, banked: 2 },
		moves: {
			active: [
				{ // roll tide
					moveTemplateId: 0,
					fragmentTemplateIds: []
				},
				{ // stone toss
					moveTemplateId: 0,
					fragmentTemplateIds: []
				},
				{ // 
					moveTemplateId: 0,
					fragmentTemplateIds: []
				},
				{ //
					moveTemplateId: 0,
					fragmentTemplateIds: []
				},
			],
			banked: [],
		},
		inventory: {
			fragments: [],
			blessings: [],
			essence: 0,
		},
	},
	{
		name: "cultivist",
		maxHp: 20,
		hp: 20,
		maxEnergy: 6,
		energy: 0,
		moveSlots: { active: 4, banked: 2 },
		moves: {
			active: [
				{ // root out
					moveTemplateId: 0,
					fragmentTemplateIds: []
				},
				{ // fire away
					moveTemplateId: 0,
					fragmentTemplateIds: []
				},
				{ // restore
					moveTemplateId: 0,
					fragmentTemplateIds: []
				},
				{ // 
					moveTemplateId: 0,
					fragmentTemplateIds: []
				},
			],
			banked: [],
		},
		inventory: {
			fragments: [],
			blessings: [],
			essence: 0,
		},
	},
	{
		name: "nomad",
		maxHp: 20,
		hp: 20,
		maxEnergy: 6,
		energy: 0,
		moveSlots: { active: 4, banked: 2 },
		moves: {
			active: [
				{ // dust up
					moveTemplateId: 0,
					fragmentTemplateIds: []
				},
				{ // general strike
					moveTemplateId: 0,
					fragmentTemplateIds: []
				},
				{ // 
					moveTemplateId: 0,
					fragmentTemplateIds: []
				},
				{ //
					moveTemplateId: 0,
					fragmentTemplateIds: []
				},
			],
			banked: [],
		},
		inventory: {
			fragments: [],
			blessings: [],
			essence: 0,
		},
	},
	{
		name: "bastard",
		maxHp: 20,
		hp: 20,
		maxEnergy: 6,
		energy: 0,
		moveSlots: { active: 4, banked: 2 },
		moves: {
			active: [
				{ // tear into
					moveTemplateId: 0,
					fragmentTemplateIds: []
				},
				{ // 
					moveTemplateId: 0,
					fragmentTemplateIds: []
				},
				{ //
					moveTemplateId: 0,
					fragmentTemplateIds: []
				},
				{ //
					moveTemplateId: 0,
					fragmentTemplateIds: []
				},
			],
			banked: [],
		},
		inventory: {
			fragments: [],
			blessings: [],
			essence: 0,
		},
	},
];

