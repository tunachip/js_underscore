// src/engine/constants.js


export const ELEMENTS = [
	'water', 'stone', 'fire', 'plant',
	'vital', 'force', 'thunder'
];

class damageRule {
	constructor (m = 0, b = [], a = 0) {
		this.modifier = m;
		this.blocks = b;
		this.absorbs = a;
	}
};

export const RULE_TABLE = {
	water: {  
		stone:	 damageRule(m = 1),
		plant:	 damageRule(a = 1),
		thunder: damageRule(m = -1),
	},        
	stone: {  
		water:   damageRule(m = -1),
		fire:    damageRule(m = 1),
		force:   damageRule(m = -2),
		thunder: damageRule(m = 1),
	},        
	fire: {   
		water:   damageRule(a = 1),
		stone:   damageRule(m = -1),
		plant:   damageRule(m = 1),
	},        
	plant: {  
		water:   damageRule(m = 1),
		fire:    damageRule(a = 1),
		vital:   damageRule(m = 1),
	},        
	vital: {  
		plant:   damageRule(m = 1),
		vital:   damageRule(m = 1),
		force:   damageRule(m = -1),
	},        
	force: {  
		stone:   damageRule(m = 1),
		vital:   damageRule(m = 1),
		thunder: damageRule(m = -1),
	},        
	thunder: {
		water:   damageRule(m = 1),
		stone:   damageRule(b = ['thunder']),
		force:   damageRule(m = -1),
	},        
};         
           
export const DAMAGE_RULES = {
	water: {
		water:	 "",
		stone:	 "modify -1",
		fire:		 "absorb +1",
		plant:	 "modify +1",
		vital:	 "",
		force:	 "",
		thunder: "modify +1",
	},
	stone: {
		water:	 "modify +1",
		stone:	 "",
		fire:		 "modify -1",
		plant:	 "",
		vital:	 "",
		force:	 "modify +1",
		thunder: "blocks +1",
	},
	fire: {
		water:	 "modify +1",
		stone:	 "modify +1",
		fire:		 "",
		plant:	 "absorb +1",
		vital:	 "",
		force:	 "",
		thunder: "",
	},
	plant: {
		water:	 "absorb +1",
		stone:	 "",
		fire:		 "modify +1",
		plant:	 "",
		vital:	 "modify +1",
		force:	 "modify -1",
		thunder: "",
	},
	vital: {
		water:	 "",
		stone:	 "",
		fire:		 "",
		plant:	 "modify -1",
		vital:	 "modify +1",
		force:	 "modify +1",
		thunder: "",
	},
	force: {
		water:	 "",
		stone:	 "modify -2",
		fire:		 "",
		plant:	 "",
		vital:	 "modify -1",
		force:	 "",
		thunder: "modify +1",
	},
	thunder: {
		water:	 "modify -1",
		stone:	 "modify +1",
		fire:		 "",
		plant:	 "",
		vital:	 "",
		force:	 "blocks +1",
		thunder: "",
	},
};

export const STATUSES = [
	"burn", "decay", "wound", "regen",
	"curse", "quick", "slow", "strong",
	"tough", "stun", "anger", "sleep",
];

export const STATUS_CAPS = {
	burn:		3,
	decay:	3,
	wound:  1000,
	regen:	5,
	curse:	5,
	quick:	3,
	slow:		3,
	strong: 5,
	tough:	5,
	stun:		3,
	anger:	3,
	sleep:	3,
};

