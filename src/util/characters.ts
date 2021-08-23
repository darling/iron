import { clamp, get, mapValues, random, sample, sampleSize } from 'lodash';

import charData from '../static/mintedchardata.json';
import { ICharacter } from '../types/db';

// THIS DOES NOT RETURN A REAL FULL CHARACTER
export const getRandCharacter = (): ICharacter => {
	// Dunno if this works

	let chosenItem = sample(charData) as ICharacter;

	chosenItem.code = Math.random().toString(20).substr(2, 6).toUpperCase();

	return chosenItem;
};

// THIS DOES NOT RETURN A REAL FULL CHARACTER
export const getCharacter = (name: string): ICharacter => {
	let chosenCharacter = get(charData, name);

	chosenCharacter.code = Math.random()
		.toString(20)
		.substr(2, 6)
		.toUpperCase();

	return chosenCharacter;
};

export const issueCharacter = (name?: string): ICharacter => {
	let base = getRandCharacter();

	if (name) {
		let override = getCharacter(name);

		if (override) base = override as ICharacter;
	}

	base.stats = mapValues(base.stats, (stat) => {
		return random(clamp(stat - 2, 0, 10), clamp(stat + 2, 0, 10));
	});

	// Luck override
	base.stats.luc = random(0, 10);

	// Health generation

	// ((end + str) / 2) * 10 + (luck * 5)
	base.hp = ((base.stats.end + base.stats.str) / 2) * 10 + base.stats.luc * 5;

	if ((base.class = 'TANK')) {
		base.hp += 30;
		base.hp = clamp(base.hp, 70, Number.MAX_SAFE_INTEGER);
	}

	return base;
};

export const numOfCharacters = () => {
	return sampleSize(charData);
};
