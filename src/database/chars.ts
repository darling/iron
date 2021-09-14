import { max, random, sample, startCase } from 'lodash';
import { getConnection } from 'typeorm';
import { NEGATIVE_FOOD_ADJECTIVES } from '../util/vocab';
import { Character } from './models/Character';
import { User } from './models/User';
import { getUser } from './user';

/**
 * @returns New Character
 */
export const newChar = async (): Promise<Character> => {
	return new Character();
};

export const newEnemy = async (): Promise<Character> => {
	let enemy = await newChar();
	enemy.name = startCase(`${sample(NEGATIVE_FOOD_ADJECTIVES)} ${enemy.name}`);
	return enemy;
};

/**
 * Mints a new character for users to use within combat
 * @param uid Discord UID
 * @returns User after mint
 */
export const newPrimary = async (uid: string): Promise<User> => {
	const connection = getConnection();
	let char = await newChar();

	let user = await getUser(uid);

	user.primary = char;
	char.user = user;

	user.lastPrimaryChange = new Date();

	await connection.manager.save(user);

	return user;
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
