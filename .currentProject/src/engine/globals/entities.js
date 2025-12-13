// globals/entities.js


export const DEFAULT_ENTITY = {
	level:  1,	// Used to Query Encounters
	burden: 0,	// Used to Query Elite Encounters
	// -----------------------
	name: "Default Entity",
	culture: "bastard",
	// -----------------------
	maxHp:		20,	// Initial MaxHP
	hp:				20,	// Initial HP
	// -----------------------
	maxEnergy: 6,	// Initial MaxEnergy
	energy:		 0,	// Initial Energy
	// -----------------------
	moveSlots: {
		active: 4,	// Limits for Initial Active Move Pool
		banked:	2,	// Limits for Initial Banked Move Pool
	},
	// -----------------------
	moves: {
		active: [], // Initial Active Move Pool
		banked: [], // Initial Banked Move Pool
	},
	// -----------------------
	inventory: {
		blessings: [],	// Rules Modifiers, Must Enter Combat
		fragments: [],	// Unused Move Rules Modifiers
		contracts: [],	// Ongoing Challenges, Discarded on Evaluation
	},
	history: {}, // Store of Player Behavior for Shadow Creation
};

export const CULTURES = [
	"mason",
	"cultivist",
	"nomad",
	"bastard"
];

export const CULTURE_ASSOCIATIONS = {
	mason: {
		elements: ["water", "stone"],
		specialties: [
			"element borrowing",
			"move banking",
			"status negation",
			"cooldown management"
		],
		progressionSystem: "Contract Fulfillment",
	},
	cultivist: {
		elements: ["fire", "plant"],
		mechanics: [
			"threshold abilities",
			"enemy predicition",
			"attunement negation",
			"energy management",
		],
		progressionSystem: "Ancestral Recollection",
	},
	nomad: {
		elements: ["force", "thunder"],
		mechanics: [
			"private information",
			"speed manipulation",
			"curse management",
			"weather events",
		],
		progressionSystem: "Blessing Recovery",
	},
	bastard: {
		elements: ["vital"],
		mechanics: [
			"mono-attunement",
			"status ignorance",
			"visceral damage",
			"move theft / countering",
		],
		progressionSystem: "Corpse Defilement",
	},
};

