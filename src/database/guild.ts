import { Guild as DJSGuild } from 'discord.js';
import { getConnection } from 'typeorm';
import { client } from '../discord';
import { Guild } from './models/Guild';
import { getUser } from './user';

/**
 * get guild db entry
 * @param guild Discord Guild Object
 */
export const getGuild = async (gid: string, relations?: string[]) => {
	const guild = await client.guilds.cache.get(gid);

	if (!guild) {
		// If the bot isn't in the guild at all
		// Mark my words this is going to be hell to figure out once sharding becomes a thing.
		return;
	}

	const user = await getUser(guild.ownerId);
	const connection = getConnection();

	let entry = await connection
		.getRepository(Guild)
		.findOne({ id: gid }, { relations });

	if (!entry) {
		entry = new Guild(guild.id, guild.name, guild.icon, user);

		// Double write to make sure that the new guild is initialized *sigh*
		console.log(entry);
	}

	return entry;
};

/**
 * Adds a new guild to the database so that Ferris knows that it's been in the server
 * @param guild The guild to add to the database
 */
export const newGuild = async (guild: DJSGuild) => {
	const connection = getConnection();
	const entry = await getGuild(guild.id);

	await connection.manager.save(entry);

	return entry;
};
