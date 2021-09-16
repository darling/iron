import { prisma } from '../pg';
import { Guild as DJSGuild } from 'discord.js';
import { client } from '../discord';
import { Guild } from '.prisma/client';
import { omit } from 'lodash';

/**
 * get guild db entry
 * @param guild Discord Guild Object
 */
export const getGuild = async (gid: string) => {
	const guild = await client.guilds.cache.get(gid);

	if (!guild) {
		// If the bot isn't in the guild at all
		// Mark my words this is going to be hell to figure out once sharding becomes a thing.
		return;
	}

	let g = await prisma.guild.findUnique({ where: { id: gid } });

	if (!g) {
		g = await prisma.guild.create({
			data: {
				id: gid,
				vanity: gid,
				name: guild.name,
				icon: guild.icon,
				owner: {
					connectOrCreate: {
						where: { id: guild.ownerId },
						create: { id: guild.ownerId },
					},
				},
			},
		});
	}

	return g;
};

export const updateGuild = async (gid: string, data: Partial<Guild>) => {
	const guild = await client.guilds.cache.get(gid);

	if (!guild) {
		// If the bot isn't in the guild at all
		// Mark my words this is going to be hell to figure out once sharding becomes a thing.
		return;
	}

	await prisma.guild.upsert({
		create: {
			// hand mutate because I can't figure out the compiler
			currency: data.currency,
			kitchen: data.kitchen,
			publicJoin: data.publicJoin,
			publicView: data.publicView,
			vanity: gid,
			// Defaults:
			id: gid,
			name: guild.name,
			icon: guild.icon,
			owner: {
				connectOrCreate: {
					where: { id: guild.ownerId },
					create: { id: guild.ownerId },
				},
			},
		},
		update: {
			...omit(data, ['id']),
			name: guild.name,
			icon: guild.icon,
		},
		where: {
			id: guild.id,
		},
	});
};

/**
 * Adds a new guild to the database so that Ferris knows that it's been in the server
 * @param guild The guild to add to the database
 */
export const newGuild = async (guild: DJSGuild) => {
	return await getGuild(guild.id);
};
