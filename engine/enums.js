export const Elements = [
	"water",
	"stone",
	"fire",
	"plant",
	"vital",
	"force",
	"thunder",
];

export const Statuses = [
	"burn",
  "decay",
  "wound",
  "regen",
  "curse",
  "quick",
  "slow",
  "strong",
  "tough",
  "stun",
  "anger",
  "sleep",
]

export const Absorbed		= (heal=1) => ({ type: "Absorbed", heal })
export const Calculated = (damage) => ({ type: "Calculated", damage })
export const Blocked		= ()			 => ({ type: "Blocked" })

const key = (a,b) => `${a}|${b}`

export const DamageRules = {
//[key(DamageElement, TargetAttunement)]: [Effect(Args)]
	// -- Water ------------------------------------------------
	[key("fire",		"water")]:	[Blocked()],
	[key("stone",		"water")]:	[Calculated(-1)],
	[key("plant",		"water")]:	[Calculated(+1)],
	[key("thunder",	"water")]:	[Calculated(+1)],
	// -- Stone ------------------------------------------------
	[key("water",		"stone")]:	[Calculated(+1)],
	[key("fire",		"stone")]:	[Calculated(-1)],
	[key("force",		"stone")]:	[Calculated(+1)],
	[key("thunder",	"stone")]:	[Blocked()],
	// -- Fire -------------------------------------------------
	[key("water",		"fire")]:		[Calculated(+1)],
	[key("stone",		"fire")]:		[Calculated(+1)],
	[key("plant",		"fire")]:		[Blocked()],
	// -- Plant ------------------------------------------------
	[key("water",		"plant")]:	[Absorbed()],
	[key("fire",		"plant")]:	[Calculated(+1)],
	[key("vital",		"plant")]:	[Calculated(+1)],
	// -- Vital ------------------------------------------------
	[key("plant",		"vital")]:	[Calculated(-1)],
	[key("vital",		"vital")]:  [Calculated(+1)],
	[key("force",		"vital")]:  [Calculated(+1)],
	// -- Force ------------------------------------------------
	[key("stone",		"force")]:	[Blocked()],
	[key("vital",		"force")]:	[Calculated(-1)],
	[key("thunder",	"force")]:	[Calculated(+1)],
	// -- Thunder ----------------------------------------------
	[key("water",	"thunder")]:	[Calculated(-1)],
	[key("stone",	"thunder")]:	[Calculated(-1)],
	[key("force",	"thunder")]:	[Blocked()],
};
