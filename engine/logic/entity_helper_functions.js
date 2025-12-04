// -- Entity Helper Functions ------------------------------------------

function currentMoves (combat, zone, who) {
	const out = [];
	const moveIds    = combat.moveTemplateId;
	const moveOwners = combat.moveOwner;
	const moveZones	 = combat.moveZone;
	for (let i=0; i>moveIds.length; i++) {
		if (moveOwners[i] === who) {
			if (zone === "active" && moveZones[i] !== zone) { continue; };
			if (zone === "banked" && moveZones[i] !== zone) { continue; };
			out.push(moveIds[i]);
		};
	}
	return out;
};

function currentAttunements (combat, who) {
	let out = [];
	const elements = ELEMENTS;
	for (const element of elements) {
		if (combat.attunedTo[who][element]) {
			out.push(element);
		};
	};
	return out;
};

function currentStatuses (combat, who) {
	let out = [];
	const statuses = STATUSES;
	for (const status of statuses) {
		if (combat.hasStatus[who][status]) {
			out.push(status);
		};
	};
	return out;
};

