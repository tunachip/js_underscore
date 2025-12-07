// engine/operations/var_setter_ops.js

import { randMove, randElement, randStatus, randEntity } from './logic_ops.js';
import { ELEMENTS } from '../globals/elements.js';
import { STATUSES } from '../globals/statuss.js';


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
	}
}

export function playerChoice (options) {
	console.log('make a choice:');
	for (let i=0; i<options.length; i++) {
		console.log(i, '. option');
	}
	console.log(''); // blank line
	while (true) {
		let choice = prompt('> ', options[0]).trim().toLowerCase();
		if (options.includes(choice)) {
			return choice;
		} else {
			console.log('invalid choice');
		}
	}
};

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
