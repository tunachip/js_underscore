// engine/operations/var_setter_ops.js

import { randInt, randMove, randElement, randStatus, randEntity } from './logic_ops.js';
import { ELEMENTS } from '../globals/elements.js';
import { STATUSES } from '../globals/statuses.js';


export function setVar (combat, key, value, secret) {
	// TODO: add system for managing secret/non-secretly held variables
	// current idea: publicDeclarationEmitter with default to secret
	if (secret) {
		console.log('secret')
	}
	combat.temp[key] = value;
	return { break: false };
}

export function randVar (combat, key, type, range, secret) {
	switch (type) {
		case 'element': {
			const value = randElement(range);
			setVar(combat, key, value, secret);
			return { break: false };
		}
		case 'status': {
			const value = randStatus(range);
			setVar(combat, key, value, secret);
			return { break: false };
		}
		case 'entity': {
			const value = randEntity(combat, range);
			setVar(combat, key, value, secret);
			return { break: false };
		}
		case 'move': {
			const value = randMove(combat, range);
			setVar(combat, key, value, secret);
			return { break: false };
		}
		default: {
			return { break: false };
		}
	}
}

export function playerChoice (options) {
	if (!options || options.length === 0) {
		return null;
	}
	if (options.length === 1) {
		return options[0];
	}
	console.log('make a choice:');
	let i = 0;
	for (const option of options) {
		console.log(i, ':', option);
		i++;
	}
	console.log(''); // blank line
	while (true) {
		const raw = prompt('> ', String(options[0]));
		if (typeof raw !== 'string') {
			console.log('invalid choice');
			continue;
		}
		const trimmed = raw.trim();
		if (trimmed === '') {
			return options[0];
		}
		const numeric = Number(trimmed);
		if (!Number.isNaN(numeric)) {
			if (numeric >= 0 && numeric < options.length) {
				return options[numeric];
			}
			if (options.includes(numeric)) {
				return numeric;
			}
		}
		if (options.includes(trimmed)) {
			return trimmed;
		}
		console.log('invalid choice');
	}
}

export function encounterChoice (options) {
	return randInt(0, options.length-1);
}

export function declareVar (combat, key, type, secret, who) {
	// TODO: Add Support for AI Decisions over randChoice
	if (who > 0) {
		const range = 'any';
		return randVar(combat, key, type, range, secret);
	}
	switch (type) {
		case 'element': {
			const choice = playerChoice(ELEMENTS);
			return setVar(combat, key, choice, secret);
		}
		case 'status': {
			const choice = playerChoice(STATUSES);
			return setVar(combat, key, choice, secret);
		}
		case 'entity': {
			const choice = playerChoice(combat.entityName);
			return setVar(combat, key, choice, secret);
		}
		case 'move': {
			const choice = playerChoice(combat.moveName);
			return setVar(combat, key, choice, secret);
		}
	}
}
