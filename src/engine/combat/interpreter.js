

function resolveMeta (key, ctx) {
	const meta = ctx.moveData ?? {};
	switch (key) {
		case 'element':		 { return meta.element; };
		case 'type':			 { return meta.type; };
		case 'speed':			 { return meta.speed; };
		case 'iterations': { return meta.iterations ?? 1; };
		case 'targets':		 { return Array.isArray(ctx.targets) ? ctx.targets[0] ?? null : ctx.targets; };
		default: {
			console.log('Metadata Item', key, 'not found in Ctx.')
			return '';
		};
	};
};

function resolveValue (value, key, ctx) {
	if (Array.isArray(value)) {
		return value.map(v => resolveValue(v, key, ctx));
	};
	if (value && typeof value === 'object') {
		return resolveArgs(value, ctx);
	};
	if (typeof value !== 'string') {
		return value;
	};

	switch (value) {
		case 'meta':		{ return resolveMeta(key, ctx); };
		case 'caster':	{ return ctx.caster; };
		case 'targets': { return ctx.targets ?? []; };
		case 'move':		{ return ctx.move; };
		default:				{ return value; };
	};
};

export function resolveArgs (args, ctx) {
	if (!args) {
		return {};
	};
	const resolved = [];
	for (const [key, value] of Object.entries(args)) {
		resolved[key] = resolveValue(value, key, ctx);
	};
	return resolved;
};

export function resolveOperation (operation, ctx) {
	if (!operation || typeof operation !== 'object') {
		return operation;
	}
	return {
		...operation,
		args: resolveArgs(operation.args, ctx),
	};
};

export function resolveOperations (operations, ctx) {
	if (!Array.isArray(operations)) {
		return [];
	};
	return operations.map(operation => resolveOperation(operation, ctx));
};

export function buildCtx ({ move, caster, targets, moveData} = {}) {
	return { move, caster, targets, moveData: moveData ?? {} };
};

