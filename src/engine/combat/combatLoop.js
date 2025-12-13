// src/engine/combat/combatLoop.js

import { Audit, Entity, Move } from '#engine/combat';


export function combatLoop (combat, had_priority = 0) {
	while (!combat.gameover) {
		
	};
};

	// Decisions Phase
	// Turn Order Calculation
	// Entity Turns
		// Audit Statuses / Cooldowns
		// Tick Damage Based Statuses from Audited (pop)
		// Check Move Validity
		// Execute Opcodes:
			// for (opcode of opcodes) {
			//	 if (opcode.break) { break; }; --> loop runs until broken
			// };
		// tick Remaining-Statuses / Cooldowns
	// Cleanup
		// 


