import { MessageEmbed } from 'discord.js';
import { Guild } from '../database/models/Guild';
import { User } from '../database/models/User';
import { client } from '../discord';
import { CURRENCY } from '../static/currency';
import { progressBar } from './format';

/**
 * Gives the embed used after a new food is generated for a user
 * @param user User that had the new food generated
 * @returns MessageEmbed
 */
export const generatedFood = async (user: User) => {
	const embed = new MessageEmbed();
	const discordUser = await client.users.fetch(user.id);

	if (user.primary === null) {
		embed.setTitle('Error: User does not have a primary food.');
		return embed;
	}

	embed.setColor('WHITE').setTimestamp();

	embed.setThumbnail(`https://ferris.gg/img/food/${user.primary.icon}.png`);

	embed.setDescription(
		`**${discordUser.username}** went shopping and picked up: **${user.primary.name}**\n\n*${user.primary.bio}*\n\nHP: ${user.primary.hp}/${user.primary.start_hp}`
	);

	return embed;
};

export const userProfileEmbed = async (user: User) => {
	const discordUser = await client.users.fetch(user.id);

	const embed = new MessageEmbed();
	embed.setColor('WHITE').setTimestamp();

	embed.setTitle(`Profile Overview: ${discordUser.username}`);

	embed.setAuthor(
		discordUser.tag,
		discordUser.avatarURL() || undefined,
		`https://ferris.gg/users/${user.id}`
	);

	if (user.primary === null) {
		// Onboarding shits
		embed.setThumbnail(
			discordUser.avatarURL() || 'https://ferris.gg/img/placeholder.png'
		);
	} else {
		embed.setThumbnail(
			`https://ferris.gg/img/food/${user.primary.icon}.png`
		);

		embed.addField(
			`${discordUser.username}'s ${user.primary.name}`,
			`HP: ${user.primary.hp}/${user.primary.start_hp}\n${progressBar(
				user.primary.hp,
				user.primary.start_hp
			)}`,
			true
		);
	}

	embed.setDescription(
		`${CURRENCY.EMOJI}: ${user.currency}\nPREMIUM: ${
			user.premium ? 'true' : 'false'
		}\nBattles: ${user.battles}\nWins: ${user.wins}`
	);

	return embed;
};

export const guildProfileEmbed = async (guild: Guild) => {
	const djsGuild = await client.guilds.fetch(guild.id);

	const embed = new MessageEmbed();

	embed.setColor('WHITE').setTimestamp();

	embed
		.setTitle(guild.name)
		.setThumbnail(
			djsGuild.iconURL() || 'https://ferris.gg/img/placeholder.png'
		);

	if (guild.kitchen) {
		embed.setDescription("Wow! She's a kitchen!");
	} else {
		embed.setDescription("Wow! She's not a kitchen :(");
	}

	return embed;
};
