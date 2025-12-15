import { Attunement, Operations } from '#engine/operations';
import { Args } from '#engine/operations';
import { Blessings } from '#engine/blessings';
// don't think about this too hard
// just imagine we have some functions here which take arguments and return the object we need

class Ctx {
	state = {
		caster: {
			id			: -1,	// index; -1 = noCaster
			isStrong: false, // value
		},
		target: {
			id			: -1, // index; -1 = noTarget
			isTough	: false, // value
		},
		move: {
			id			:	-1, // index; -1 = noMove
			type		:	-1, // index; -1 = noMove
			zone		:	-1, // index; -1 = noMove
			element	: -1, // index; -1 = noElement
			iterations:1, // value
		},
	};
	cache = { tempVars: {} };
	deferredListeners = [];
};

class World { // example with 2 generic entities
	constructor () {
		this.turn = 1;
		this.hp = [20, 20];
		this.maxHp = [20, 20];
		this.hasStatus = [
			{strong: false, tough: false},
			{strong: false, tough: false},
		];
		this.hasListener = [ // example for world where there are only 5 listener events
			[false, false, false, false, false],
			[false, false, false, false, false],
		];
		this.ownedMoves = [
			[0, 1],
			[3, 4],
		];
		this.moveId = [11, 12, 2, 44];
		this.blessingOwner = [
			[],
			[0],
		];
		this.blessingId = [
			51	// logic for blessing execution will be loaded on trigger via a lookuptable object via the namespace
			//	blessings are listenerLogic Modules
			//	simply put, when the listener triggers, the function from namespace Blessings will call
		];
		this.listeners = [
			[], // indexed by listener id
			[],	// contains an array of blessingItems which trigger via the listener 
			[],	// ex: this.listeners[11] = [0, 11] would mean blessing 0 and 1 have the listeners for Attunements.apply
			[],
			[],
		];
		this.entityTurnEvents = [
			// One per entity, reflecting their turn phases
			{
				startOfTurn:[], // after status/cooldown audits, before damage-based status effects
				startOfMove:[], // after damage-based status effects and disqualifiers check, before moveExecution loop
				endOfMove:	[], // after moveExecution loop, before statuses and cooldowns tick per the prior audit
				endOfTurn:	[], // after tickers, before passing to next entity turn
				onDeath:		[], // on death event, this triggers -- used for 'exploding body' and 'ignore death'l style effects
			},
			{
				startOfTurn:[], startOfCombat:[], endOfCombat:[], endOfTurn:[], onDeath:[],
			},
		];
		this.combatTurnEvents = {
			startOfDecisions: [],					// this is when players make their move choices
			startOfSpeedCalculations: [],	// this is after move choices, before turn order is calculated
			startOfEntityTurns: [],				// this is after turn order calculation, before each entity takes their turn
			endOfEntityTurns: [],					// this if after turns, aka the 'cleanup' phase
			onWeatherEventTrigger: [],		// represents effects which occur when weather event trigger happens
		};
	};
};

function processArgs (world, ctx, operation) {
	const confirmedArgs = {};
	for (const arg of operation.args) {
		if (!ctx.cache?.[arg] || ctx.dirty?.[arg]) {
			confirmedArgs[arg] = world[arg][ctx.caster.id];
		} else {
			confirmedArgs[arg] = ctx.cache[arg];
		};
	};
	return confirmedArgs;
};

function processResults (ctx, results) {
	if (results.break) {
		return { break: true };
	};
	// update cache
	for (const arg of results.changed) {
		ctx.cache[arg] = arg.value;
	};
	// add tempvars to cache
	for (const newVar of results.setVars) {
		ctx.cache.tempVars[newVar] = newVar.value;
	};

	return { break: false };
};

function triggerListeners (world, emitter) {
	const results = {
		changed: [],
		deferred: [],
	};
	for (const listener of world.listeners[emitter]) {
		for (const blessing of listener) { // blessing id gotten via array stored in world.listeners indexed by the blessing index
			const entity = world.blessingOwner[blessing];
			const effects = Blessings[emitter];
			results.changed[entity] = effects.changed;
			results.deferred[entity] = effects.deferred;
			results.worldDeferred = effects.worldDeferred;
			// potential issue: if blessing effects modify state, this approach will not account for side effects of side effects properly?
			// we might instead want to FULLY resolve the effects of the changed ctx values right away
			// this would mean instead we need an internal 'changeUpdater' instead of doing it on return
			// after some thought, this seems like the right method
		};
	};
	return results;
};

function scoutListeners (world, emitter, args) {
	const caster = args.caster;
	if (world.hasListener[caster][emitter]) {
		const results = triggerListeners(world, emitter);
		for (const change of results.changed[caster]) {
			args[change] = change.value;
		};
		for (const entity of results.deferred) {
			for (const change of results.deferred[entity]) {
				world.entityTurnEvents[caster] = change.value;
			};
		};
		const phases = [
			'startOfDecisions',
			'startOfSpeedCalculations',
			'startOfEntityTurns',
			'endOfEntityTurns',
			'onWeatherEventTrigger',
		];
		for (const phase of phases) {
			world.combatTurnEvents[phase] = results.worldDeferred[phase];
		};
	};
	return args;
};

// ---- Pretend these are inside of Attunements Namespace ----

// Attunement.apply:
export function apply (world, args) {
	const emitter = 11; // emitterId for 'Attunements.apply'
	args = scoutListeners(world, emitter, args);
	let target = args.target;
	let element = args.element;
	world.attunedTo[target][element] = true;
	return { break: false };
};

// Attunement.negate:
export function negate (world, args) {
	const emitter = 12; // emitterId for 'Attunements.negate'
	args = scoutListeners(world, emitter, args);
	const target = args.target;
	const element = args.element;
	world.attunedTo[target][element] = false;
	return { break: false };
};

// ----------------------------------------------------------

function executeOperation (world, ctx, opId) {
	// all functions return both a 'breaks' bool, as well as the changed values
	const operation = {
		id: opId,
		args: Args[id], // Args is an Object for TableLookup of Args Needed
	};
	const args = processArgs(world, ctx, operation);
	switch (operation) {
		case 0: {
			// calls the function per the enumId for operations, which I can make after this.
			const results = Attunement.apply(world, args); // exampleFunction
			return processResults(ctx, results);
		};
		case 1: {
			const results = Attunement.negate(world, args); // exampleFunction
			return processResults(ctx, results);
		};
		default: {
			return {
				break: false,
			};
		};
	};
};

function executeMove (world, ctx, move, caster, target) {
	ctx.caster.id = caster;
	ctx.move = {
		id: move,
		type: world.moveType[move],
		zone: world.moveZone[move],
		element: world.moveElement[move],
	};
	if (ctx.move.type === 0) { // 0 = attack, 1 = utility
		ctx.move.iterations = world.moveIterations[move];
		ctx.caster.isStrong = world.hasStatus[caster].strong;
		ctx.target.isTough = world.hasStatus[target].tough;
	};
	// Operations is an Object for TableLookup of Operation Ids - returns a list of Int Ids
	const operations = Operations[move];
	for (opId of operations) {
		if (executeOperation(world, ctx, opId)) {
			// return whether or not the break happened because an entity died
			return (world.hp[0] === 0 || world.hp[1] === 0);
		};
	};
	// return false as default 'no one died'
	return false;
};

function combatLoop (world, ctx) {
	while (true) {
		let firstUp = world.turn % 2; // will always be either 1 or 0
		let turnOrder = [ firstUp, 1 - firstUp];
		for (entity of turnOrder) {
			const move = world.ownedMoves[entity][Math.random()];
			const target = 1 - entity;
			if (executeMove(world, ctx, move, entity, target)) {
				return (world.hp[0] === 0); // return if player is dead as loss condition;
			};
		};
	};
};

const world = new World();
const ctx = new Ctx();

if (combatLoop(world, ctx)) {
	console.log('Player Lost!');
} else {
	console.log('Player Won!');
};

