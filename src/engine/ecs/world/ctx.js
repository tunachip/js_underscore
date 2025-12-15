// src/engine/ecs/world/ctx.js


class Ctx {
	//	Ctx Acts as a Light Storage Location for Cached Storage of Turn Variables
	//	The Most Common thing to keep track of is:
	constructor () {
		this.combat					= {},	// CombatState Object
		this.casterEntity		= -1,	// Index of Caster
		this.targetEntitys	= [],	// Array of Targets Indecies (Indexes, Indexi, Indexium, suck me)
		this.moveChoice			= -1,	// Index of Caster's Movechoice
		this.args						= {}	// Auxillary Storage for Short Term Declarations
		this.needed					= []  // List of Needed Vars per Current Operation
	};

	register (key, value) {
		// Adds a Value to Temporary Storage
		this.args[key] = value;
	};

	clear () {
		// clears out Temporary Storage
		this.args = {};
	};
};


