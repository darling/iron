import { Character, Guild, User } from '@prisma/client';
import { InteractionReplyOptions, MessageEmbed } from 'discord.js';
import { client } from '../discord';
import { CURRENCY } from '../static/currency';
import { progressBar } from './format';

/**
 * Gives the embed used after a new food is generated for a user
 * @param user User that had the new food generated
 * @returns MessageEmbed
 */
export const generatedFood = async (
	user: User & { character: Character | null }
) => {
	const embed = new MessageEmbed();
	const discordUser = await client.users.fetch(user.id);

	if (user.character === null) {
		embed.setTitle('Error: User does not have a primary food.');
		return embed;
	}

	embed.setColor('WHITE').setTimestamp();

	embed.setThumbnail(`https://ferris.gg/img/food/${user.character.icon}.png`);

	embed.setDescription(
		`**${discordUser.username}** went shopping and picked up: **${user.character.name}**\n\n*${user.character.bio}*\n\nHP: ${user.character.hp}/${user.character.start_hp}`
	);

	return embed;
};

/**
 * Gives the embed used after a new food is generated for a user
 * @param user User that had the new food generated
 * @returns MessageEmbed
 */
export const characterViewEmbed = async (
	user: User & { character: Character | null }
) => {
	const embed = new MessageEmbed();
	const discordUser = await client.users.fetch(user.id);

	embed.setColor('WHITE').setTimestamp();

	if (user.character === null) {
		embed.setTitle('You do not have a food!');
		return embed;
	}

	embed.setThumbnail(`https://ferris.gg/img/food/${user.character.icon}.png`);

	embed.setDescription(
		`**${discordUser.username}**'s **${user.character.name}**\n\n*${
			user.character.bio
		}*\n\nHP: ${user.character.hp}/${
			user.character.start_hp
		}\n${progressBar(user.character.hp, user.character.start_hp)}\n\n${
			user.character.name
		} has battled ${user.character.battles} times and won ${
			user.character.wins
		} of those battles.\n\nCreated: ${user.character.createdDate.toLocaleDateString()}`
	);

	embed.setFooter(`${user.character.id}`);

	return embed;
};

export const userProfileEmbed = async (
	user: User & { character: Character | null }
) => {
	const discordUser = await client.users.fetch(user.id);

	const embed = new MessageEmbed();
	embed.setColor('WHITE').setTimestamp();

	embed.setTitle(`Profile Overview: ${discordUser.username}`);

	embed.setAuthor(
		discordUser.tag,
		discordUser.avatarURL() || undefined,
		`https://ferris.gg/users/${user.id}`
	);

	if (!user.character) {
		// Onboarding shits
		embed.setThumbnail(
			discordUser.avatarURL() || 'https://ferris.gg/img/placeholder.png'
		);
	} else {
		embed.setThumbnail(
			`https://ferris.gg/img/food/${user.character.icon}.png`
		);

		embed.addField(
			`${discordUser.username}'s ${user.character.name}`,
			`HP: ${user.character.hp}/${user.character.start_hp}\n${progressBar(
				user.character.hp,
				user.character.start_hp
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

export const onboardUserEmbed = async (
	uid: string
): Promise<InteractionReplyOptions> => {
	const djsUser = await client.users.fetch(uid);

	const embed = new MessageEmbed();

	embed.setColor('WHITE').setTimestamp();
	embed.setThumbnail('https://i.imgur.com/mfYRJmk.png');
	embed.setImage('https://i.imgur.com/WbJL8aj.png');

	embed.setTitle(`Welcome, ${djsUser.username}!`);

	let desc =
		'We hope that you enjoy participating in our global food battle! Ferris needs you to follow our rules in order to play our game!\n\n';
	desc +=
		"Because there's a global economy and players may compete with/or against each other, we need to make sure everyone plays fair. \n\n";
	desc += 'Please check out our [Global Rules](https://ferris.gg/rules).\n';
	desc +=
		'We also have [TOS](https://ferris.gg/tos) and our [Privacy Policy](https://ferris.gg/tos).\n\nThanks! Have a fun time!';

	embed.setDescription(desc);

	return {
		embeds: [embed],
		components: [
			{
				type: 'ACTION_ROW',
				components: [
					{
						type: 'BUTTON',
						style: 'PRIMARY',
						label: 'I Understand The Rules',
						customId: 'NEWUSER',
					},
					{
						type: 'BUTTON',
						style: 'LINK',
						url: 'https://ferris.gg/',
						label: 'Learn More',
					},
				],
			},
		],
	};
};
