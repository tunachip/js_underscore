// src/engine/combat/combatLoop.js

import { Audit, Entity, Move } from '#engine/combat';
import { Event } from '#engine/operations';

export function combatLoop (combat, had_priority = 0) {
	while (!combat.gameover) {
		// Decisions Phase
		Phase.makeDecisions(combat);
		// Turn Order Calculation
		const turnOrder = Phase.calculateTurnOrder(combat);
		// Entity Turns
		Phase.entityTurns(combat, turnOrder);
			// Audit Statuses / Cooldowns
			// Tick Damage Based Statuses from Audited (pop)
			// Check Move Validity
			if (Entity.invalidMoveChoice) {
				Event.skipTurn(combat, who);
			};
			// Execute Opcodes:
				// for (opcode of opcodes) {
				//	 if (opcode.break) { break; }; --> loop runs until broken
				// };
			// tick Remaining-Statuses / Cooldowns
		// Cleanup
		Phase.cleanup(combat);
			// 
	};
};

