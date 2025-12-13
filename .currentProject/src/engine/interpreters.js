// engine/interpreters.js
// Helpers to resolve placeholder tokens in operation args before executing opcodes.
// Tokens we currently handle:
// - 'meta' -> move metadata (element, iterations, speed, type, etc.) keyed by the arg name
// - 'caster' -> acting entity index
// - 'targets'/'selected' -> chosen target list
// - 'primary' -> first target in the chosen list
// - 'self'/'move' -> the move's index/id in combat arrays

/**
 * Resolve a single token value.
 * @param {any} value - incoming arg value
 * @param {string} key - arg name (used to map meta tokens)
 * @param {object} ctx - interpreter context
 * @returns {any} resolved value
 */
function resolveValue (value, key, ctx) {
	// Arrays: resolve each element
	if (Array.isArray(value)) {
		return value.map(v => resolveValue(v, key, ctx));
	}
	// Objects: resolve nested keys
	if (value && typeof value === 'object') {
		return resolveArgs(value, ctx);
	}
	// Primitives other than strings pass through
	if (typeof value !== 'string') {
		return value;
	}

	switch (value) {
		case 'meta': {
			return resolveMeta(key, ctx);
		}
		case 'caster': {
			return ctx.caster;
		}
		case 'targets':
		case 'selected': {
			return ctx.targets ?? [];
		}
		case 'target': {
			const targets = ctx.targets ?? [];
			return Array.isArray(targets) ? targets[0] ?? null : targets;
		}
		case 'primary': {
			const targets = ctx.targets ?? [];
			return Array.isArray(targets) ? targets[0] ?? null : targets;
		}
		case 'self':
		case 'move': {
			return ctx.moveIndex;
		}
		default:
			return value;
	}
}

/**
 * Resolve meta token based on arg name.
 * @param {string} key - arg name (element/times/etc.)
 * @param {object} ctx - interpreter context containing moveMeta
 */
function resolveMeta (key, ctx) {
	const meta = ctx.moveMeta || {};
	switch (key) {
		case 'element':
			return meta.element;
		case 'times':
		case 'iterations':
			return meta.iterations ?? 1;
		case 'target':
			if (ctx.targets) {
				return Array.isArray(ctx.targets) ? ctx.targets[0] ?? null : ctx.targets;
			}
			return null;
		case 'speed':
			return meta.speed;
		case 'type':
			return meta.type;
		default:
			// Fallback: try arg name, then element
			return meta[key] ?? meta.element;
	}
}

/**
 * Resolve all args of an operation.
 * @param {object} args - raw args object from template
 * @param {object} ctx - interpreter context
 * @returns {object} resolved args
 */
export function resolveArgs (args, ctx) {
	if (!args) {
		return {};
	}
	const resolved = {};
	for (const [key, value] of Object.entries(args)) {
		resolved[key] = resolveValue(value, key, ctx);
	}
	return resolved;
}

/**
 * Resolve a single operation (shallow copy with resolved args).
 * @param {object} operation - raw operation object
 * @param {object} ctx - interpreter context
 * @returns {object} resolved operation
 */
export function resolveOperation (operation, ctx) {
	if (!operation || typeof operation !== 'object') {
		return operation;
	}
	return {
		...operation,
		args: resolveArgs(operation.args, ctx),
	};
}

/**
 * Resolve a list of operations.
 * @param {Array} operations - list of raw operations
 * @param {object} ctx - interpreter context
 * @returns {Array} resolved operations
 */
export function resolveOperations (operations, ctx) {
	if (!Array.isArray(operations)) {
		return [];
	}
	return operations.map(op => resolveOperation(op, ctx));
}

/**
 * Build a normalized interpreter context.
 * @param {object} params
 * @param {number|string} params.moveIndex - identifier/index for the move
 * @param {number|string} params.caster - acting entity index
 * @param {Array|number|string} params.targets - chosen targets (entity or move indices)
 * @param {object} params.moveMeta - runtime move metadata (element, iterations, speed, type, etc.)
 */
export function createInterpreterContext ({ moveIndex, caster, targets, moveMeta } = {}) {
	return {
		moveIndex,
		caster,
		targets,
		moveMeta: moveMeta || {},
	};
}
