

enum Element {
};

interface CombatMove {
	baseDamage?: number;
	element: Element;
};

interface Operation {
		code: string;
		args: Array<{
				[key: string]: number;
		}>;
};

const val_1 = 5;
const val_2 = 'pig';
const obj: Operation = {
	code: 'five pigs',
	args: [
		{
			[val_2]: val_1
		}
	]
};

interface Sequence {
		operations: Operation[];
};

function executeMoveSequence (sequence: Sequence) {
	for (const move of sequence.operations) {
		console.log(move['name']);
	};
};

