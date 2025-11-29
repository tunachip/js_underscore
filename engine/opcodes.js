/*====================================
	engine/opcodes.js
	
	
	
	==================================== */


export const OpCode = Object.freeze({
	SEQUENCE:						1,
	LOOP:								2,
	BRANCH:							3,
	SET_VAR:						4,
	RAND_VAR:						5,
	DECLARE_VAR:				6,
	APPLY_ATTUNEMENT:		7,
	NEGATE_ATTUNEMENT:	8,
	SPEND_ATTUNEMENT:		9,
	APPLY_STATUS:				10,
	NEGATE_STATUS:			11,
	REDUCE_STATUS:			12,
	EXTEND_STATUS:			13,
	APPLY_ENERGY:				14,
	NEGATE_ENERGY:			15,
	REDUCE_ENERGY:			16,
	SPEND_ENERGY:				17,
	APPLY_COOLDOWN:			18,
	NEGATE_COOLDOWN:		19,
	REDUCE_COOLDOWN:		20,
	EXTEND_COOLDOWN:		21,
	SET_MOVE_ZONE:			22,
	SET_MOVE_BOUND:			23,
	SET_MOVE_SPEED:			24,
	SET_MOVE_ELEMENT:		25,
	SET_MOVE_PRIVATE:		26,
	SET_MOVE_IGNORES:		27,
	SET_MOVE_TIMES:			28,
	APPLY_CURSE_CHANCE:	29,
	REDUCE_CURSE_CHANCE:30,
	DEAL_DAMAGE:				31,
	HEAL:								32,
})



function _eval_arg(world, ctx, value) {
	if (value.type === Callable) {
		return value(world, ctx);
	} else {
		return value;
	}
}
