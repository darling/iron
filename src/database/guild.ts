import { Guild } from 'discord.js';
import { IGuild } from '../types/db';
import { firebaseAdmin } from '../util/firebase';

const db = firebaseAdmin.firestore();

/**
 * Adds a new guild to the database so that Ferris knows that it's been in the server
 * @param guild The guild to add to the database
 */
export const newGuild = async (guild: Guild) => {
	await setGuild(guild.id, {
		name: guild.name,
		icon: guild.icon || undefined,
	});
};

/**
 *	Write to Guild
 * @param id ID of the Guild
 * @param data The data to add to the guild, any data that is given overlaps existing data. Make sure to cast to any if the value is a firestore object
 */
export const setGuild = async (id: string, data: Partial<IGuild>) => {
	await db.collection('guilds').doc(id).set(data, { merge: true });
};
