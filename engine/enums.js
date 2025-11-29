// ====================================
//	engine/enums.js
//
//
// ====================================

export const Element = Object.freeze({
	WATER:		0,
	STONE:		1,
	FIRE:			2,
	PLANT:		3,
	VITAL:		4,
	FORCE:		5,
	THUNDER:	6,
});

export const Status = Object.freeze({
	BURN:			0,
  DECAY:		1,
  WOUND:		2,
  REGEN:		3,
  CURSE:		4,
  QUICK:		5,
  SLOW:			6,
  STRONG:		7,
  TOUGH:		8,
  STUN:			9,
  ANGER:	 10,
  SLEEP:	 11,
});

export const Zone = Object.freeze({
	ACTIVE:		0,
	BANKED:		1,
});

export const MoveType = Object.freeze({
	ATTACK:		0,
	UTILITY:	1,
});

export const MoveSpeed = Object.freeze({
	SLOW:			0,
	NORMAL:		1,
	QUICK:		2,
});

export const Entity = Object.freeze({
	PLAYER:		0,
	ENEMY:		1,
});
