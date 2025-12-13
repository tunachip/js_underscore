import { createCombatState } from '../engine/combatStore.js';
import { basicWaterAttack } from '../engine/templates/water_attack_template.js';
import { basicFireAttack } from '../engine/templates/fire_attack_template.js';
import { basicPlantAttack } from '../engine/templates/plant_attack_template.js';
import { executeOperations } from '../engine/opcode_reader.js';

function logState(label, combat) {
  console.log(label);
  console.log('Player HP:', combat.hp[0], '/', combat.maxHp[0]);
  console.log('Enemy HP:', combat.hp[1], '/', combat.maxHp[1]);
  console.log('---');
}

function resolveOps(move, caster, target) {
  const resolveArg = (key, value) => {
    if (value === 'meta') {
      if (key === 'element') return move.element;
      if (key === 'times') return move.iterations ?? 1;
      if (key === 'target') return target;
      return move[key];
    }
    if (value === 'caster') return caster;
    if (value === 'target') return target;
    return value;
  };
  const resolveArgs = (args) => {
    const out = {};
    for (const [k, v] of Object.entries(args ?? {})) {
      out[k] = Array.isArray(v) ? v.map((item) => resolveArg(k, item)) : resolveArg(k, v);
    }
    return out;
  };
  const walk = (ops) => ops.map(op => {
    const resolved = { ...op, args: resolveArgs(op.args) };
    if (resolved.code === 'loop' && Array.isArray(resolved.args.inner)) {
      resolved.args.inner = walk(resolved.args.inner);
    }
    if (resolved.code === 'sequence' && Array.isArray(resolved.args.inner)) {
      resolved.args.inner = walk(resolved.args.inner);
    }
    if (resolved.code === 'branch') {
      if (Array.isArray(resolved.args._then)) resolved.args._then = walk(resolved.args._then);
      if (Array.isArray(resolved.args._else)) resolved.args._else = walk(resolved.args._else);
    }
    return resolved;
  });
  return walk(move.operations);
}

function main() {
  const player = {
    name:				'Player',
    maxHp:			20,
    hp:					20,
    maxEnergy:	6,
    energy:			0,
    moves: {
			active: [
				basicWaterAttack,
				basicFireAttack,
				basicPlantAttack
			],
			banked: [

			]
		}
  };
  const enemy = {
    name:				'Enemy',
    maxHp:			16,
    hp:					16,
    maxEnergy:	4,
    energy:			0,
    moves: {
			active: [
				basicWaterAttack,
				basicFireAttack,
				basicPlantAttack
			],
			banked: [

			]
		}
  };

  const combat = createCombatState(player, [enemy]);
  const caster = 0;
  const target = 1;
  const moveIndex = 0; // first move added for player

  logState('Before cast basicWaterAttack:', combat);
  let resolvedOps = resolveOps(basicWaterAttack, caster, target);
  let result = executeOperations(combat, moveIndex, caster, [target], resolvedOps);
  console.log('Result break flag:', result.break);

  logState('Before cast basicFireAttack:', combat);
  resolvedOps = resolveOps(basicFireAttack, caster, target);
  result = executeOperations(combat, moveIndex, caster, [target], resolvedOps);
  console.log('Result break flag:', result.break);

  logState('Before cast basicPlantAttack:', combat);
  resolvedOps = resolveOps(basicPlantAttack, caster, target);
  result = executeOperations(combat, moveIndex, caster, [target], resolvedOps);
  console.log('Result break flag:', result.break);

  logState('After cast:', combat);
}

main();
