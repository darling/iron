import axios from 'axios';
import { clamp, get, mapValues, random, sample, sampleSize } from 'lodash';

import { ICharacter, IPreMintCharacter } from '../types/db';

import charData from '../static/mintedchardata.json';

const genCode = () => {
	return Math.random().toString(20).substr(2, 6).toUpperCase();
};

const randStat = (stat: number, radius: number): number => {
	return random(clamp(stat - radius, 0, 10), clamp(stat + radius, 0, 10));
};

const mintCharacter = (preMint: IPreMintCharacter): ICharacter => {
	let outItem: ICharacter = {
		...preMint,
		bio: preMint.bio.replace(/^(")|(")$/g, ''),
		hp: 1,
		startHp: 1,
		code: '',
		stats: {
			id: preMint.id,
			name: preMint.name,
			strength: randStat(preMint.stats.strength, 2),
			magic: randStat(preMint.stats.magic, 2),
			intellect: randStat(preMint.stats.intellect, 2),
			luck: randStat(5, 5),
			endurance: randStat(preMint.stats.endurance, 2),
			swiftness: randStat(preMint.stats.swiftness, 2),
		},
	};

	outItem.hp =
		((outItem.stats.endurance + outItem.stats.strength) / 2) * 10 +
		outItem.stats.luck * 5;

	if ((outItem.class = 'TANK')) {
		outItem.hp += 30;
		outItem.hp = clamp(outItem.hp, 70, Number.MAX_SAFE_INTEGER);
	}

	outItem.startHp = outItem.hp;

	outItem.code = genCode();

	return outItem;
};

// THIS DOES NOT RETURN A REAL FULL CHARACTER
export const getRandCharacter = (): ICharacter => {
	// Dunno if this works

	const chosenItem = sample(charData) as IPreMintCharacter;

	const outItem = mintCharacter(chosenItem);

	return outItem;
};

// THIS DOES NOT RETURN A REAL FULL CHARACTER
export const getCharacter = (name: string): ICharacter => {
	let chosenCharacter = get(charData, name) as IPreMintCharacter;

	const outItem = mintCharacter(chosenCharacter);

	return outItem;
};

export const issueCharacter = (name?: string): ICharacter => {
	let base = getRandCharacter();

	if (name) {
		let override = getCharacter(name);

		if (override) base = override as ICharacter;
	}

	return base;
};

export const numOfCharacters = () => {
	return sampleSize(charData);
};
