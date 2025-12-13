// engine/entitystore.js


export class PlayerState {
	constructor (template) {
		this.level = 0;
		this.maxHp =		template.maxHp | 20;
		this.hp	=				template.hp | 20;
		this.maxEnergy= template.maxEnergy | 6;
		this.energy	=		template.energy | 0;
		this.moveSlots = {
			active: template.moveSlots.active | 4,
			banked: template.moveSlots.banked | 2
		}
		this.moves = {
			active:	template.moves.active | [],
			banked:	template.moves.banked | [],
		};
		this.inventory = {
			fragments: template.inventory.fragments | [],
			blessings: template.inventory.blessings | [],
			essence:	 template.inventory.essence | 0,
		};
		this.history = {
		};
	};
};

function zoneHasRoom (player, zone) {
	switch (zone) {
		case "active": { 
			const slots = player.moveSlots.active;
			const count = player.moves.active.length;
		  if (slots > count) {
				return true;
			};
		};
		case "banked": {
			const slots = player.moveSlots.banked;
			const count = player.moves.banked.length;
		  if (slots > count) {
				return true;
			};
		};
	};
};

function insertCombatMove (player, zone, position, move) {
	if (zoneHasRoom(player, zone)) {
		switch (zone) {
			case "active": player.moves.active.splice(position, 0, move);
			case "banked": player.moves.banked.splice(position, 0, move);
		};
		return true;
	};
	return false;
};

function removeCombatMove (player, zone, position) {
	switch (zone) {
		case "active": player.moves.active.pop(position);
		case "banked": player.moves.banked.pop(position);
	};
};

function changeMovePosition (player, oldPosition, oldZone, newPosition, newZone) {
	const move = removeCombatMove(player, oldZone, oldPosition);
	if (insertCombatMove(player, newZone, newPosition, move)) {
		return true;
	};
	insertCombatMove(player, oldZone, oldPosition, move);
	return false;
};

function increaseLevel (player, amount) {
	player.level += amount;
};

function decreaseLevel (player, amount) {
	player.level -= amount;
};

function increaseMaxHp (player, amount) {
	player.maxHp += amount;
};

function decreaseMaxHp (player, amount) {
	player.maxHp -= amount;
};

function increaseInitialHp (player, amount) {
	player.hp += amount;
};

function decreaseInitialHp (player, amount) {
	player.hp -= amount;
};

function increaseMaxEnergy (player, amount) {
	player.maxEnergy += amount;
};

function decreaseMaxEnergy (player, amount) {
	player.maxEnergy -= amount;
};

function increaseInitialEnergy (player, amount) {
	player.energy += amount;
};

function decreaseInitialEnergy (player, amount) {
	player.energy -= amount;
};

function increaseMoveSlots (player, type, amount) {
	switch (type) {
		case "active": player.moveSlots.active += 1;
		case "banked": player.moveSlots.banked += 1;
	};
};

function decreaseMoveSlots (player, type, amount) {
	switch (type) {
		case "active": player.moveSlots.active -= 1;
		case "banked": player.moveSlots.banked -= 1;
	};
};

function hasEmptyFragmentSlots (player, zone, position) {
	return (player.moves[zone][position].fragmentTemplate.name);
};

function applyMoveFragment (player, fragmentIndex, zone, position) {
	const move = player.moves[zone][position];
	if (hasEmptyFragmentSlots(player, move)) {
		const fragment = player.inventory.fragments.pop(fragmentIndex);
		move.fragmentTemplate.push(fragment);
		return true;
	};
	return false;
};

function removeMoveFragment (player, zone, position) {
	const move = player.moves[zone][position];
	if (hasFragment(player, move)) {
		const fragment = move.fragmentTemplate.pop();
		player.inventory.push(fragment);
		return true;
	};
	return false;
};

