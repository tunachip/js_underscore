// globals/elements.js


export const ELEMENTS = [
	"water",
	"stone",
	"fire",
	"plant",
	"vital",
	"force",
	"thunder"
];

export const ELEMENT_DAMAGE_CALCULATIONS = {
	water: {
		water:	 "",
		stone:	 "modify -1",
		fire:		 "absorb 1",
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

