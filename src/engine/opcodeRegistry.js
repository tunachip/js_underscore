// src/engine/opcodeRegistry.js


const OPERATION_NEEDS = {
	attunement: {               
		apply: ['element', 'who'], 
		negate: ['element', 'who'],
		spend: ['element', 'who'], 
	},                          
	cooldown: {                 
		apply: ['turns', 'move'],  
		negate: ['move'],
		reduce: ['turns', 'move'],
		extend: ['turns', 'move'],
		spend: ['turns', 'move'],
	},
	curseChance : {
		apply: ['amount', 'who'],
		negate: ['who'],
		reduce: ['amount', 'who'],
		spend: ['amount', 'who'],
	},
	damage: {
		attack: ['element', 'damage', 'caster', 'target'],
		deal: ['amount', 'who'],
		calculate: ['element', 'damage', 'target'],
	},
	energy: {
		apply: ['amount', 'who'],
		negate: ['who'],
		reduce: ['amount', 'who'],
		spend: ['amount', 'who'],
	},
	event: {
		heal: ['amount', 'who'],
		openWounds: ['amount', 'who'],
		attemptCurse: ['who'],
		skipTurn: ['who'],
	},
	ignores: {
		apply: ['status', 'who'],
		negate: ['status', 'who'],
		spend: ['status', 'who'],
	},
	immunity: {
		apply: ['status', 'who'],
		negate: ['status', 'who'],
		spend: ['status', 'who'],
	},
	logic: {
		setVar: ['key', 'value', 'secret'],
		randVar: ['key', 'type', 'range', 'secret'],
		declareVar: ['key', 'type', 'secret', 'who'],
	},
	moveElement : {
		set: ['element', 'move'],
	},
	moveIgnoresStatus: {
		set: ['turns', 'status', 'move'],
		apply: ['turns', 'status', 'move'],
		negate: ['status', 'move'],
		reduce: ['turns', 'status', 'move'],
	},
	moveIterations: {
		set: ['amount', 'move'],
		apply: ['amount', 'move'],
		negate: ['move'],
		reduce: ['amount', 'move'],
	},
	movePublicity: {
		set: ['state', 'move'],
		privatize: ['move'],
		publicize: ['move'],
	},
	moveSpeed: {
		set: ['speed', 'move'],
		negate: ['move'],
		apply: ['amount', 'move'],
		reduce: ['amount', 'move'],
	},
	moveZone: {
		set: ['zone', 'move'],
		bank: ['move'],
		unbank: ['move'],
	},
	status: {
		apply: ['turns', 'status', 'who'],
		negate: ['status', 'who'],
		reduce: ['turns', 'status', 'who'],
		extend: ['turns', 'status', 'who'],
		spend: ['turns', 'status', 'who'],
	},
	tick: {
		status: ['turns', 'status', 'who'],
	},
};
