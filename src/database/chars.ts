import { Character } from '@prisma/client';
import { max, random, sample, startCase } from 'lodash';

import { prisma } from '../pg';
import charList from '../static/chars.json';
import { NEGATIVE_FOOD_ADJECTIVES } from '../util/vocab';

/**
 * @returns New Save-able Character
 */
export const newChar = () => {
	const char = sample(charList);

	if (!char) throw 'Char sample error';

	const hp = random(50, 100);

	return {
		name: char.name,
		bio: char.bio,
		hp: hp,
		start_hp: hp,
		icon: char.icon,
	};
};

export const newEnemy = () => {
	let enemy = newChar();
	enemy.name = startCase(`${sample(NEGATIVE_FOOD_ADJECTIVES)} ${enemy.name}`);
	return enemy;
};

/**
 * Mints a new character for users to use within combat
 * @param uid Discord UID
 * @returns User after mint
 */
export const newPrimary = async (uid: string) => {
	let char = newChar();

	return await prisma.character.create({
		data: {
			...char,
			owner: {
				connectOrCreate: {
					create: {
						id: uid,
					},
					where: {
						id: uid,
					},
				},
			},
		},
		include: {
			owner: true,
		},
	});
};

/**
 * Non negative character damage function
 * @param char Character to inflict dmg
 * @param dmg int of dmg points
 * @returns mutated character
 */
export const characterDamageAdd = async (
	char: Character,
	dmg: number
): Promise<Character> => {
	char.hp = max([char.hp - dmg, 0]) || 0;
	return char;
};
