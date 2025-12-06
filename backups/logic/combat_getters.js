// -- General Logic Functions ------------------------------------------

function randInt (low, high) {
	return Math.floor(Math.random() * (high - low + 1)) + low;
};

function randElement () {
	return ELEMENTS[randInt(0, ELEMENTS.length)];
};

function randStatus () {
	return STATUSES[randInt(0, STATUSES.length)];
};

function randEntity (combat) {
	return combat.entityId[randInt(0, combat.entityId.length)];
};

function makeChoice (options) {
	console.log("Make a Choice");
	for (option of options) {
		console.log(option);
	};
	while (true) {
		let choice = prompt("> ", options[0]).trim().toLowerCase();
		if (choice in options) {
			return choice;
		} else {
			console.log("<ERR> Invalid Choice")
		}
	};
};

