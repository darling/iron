import { Character, Guild, User } from '@prisma/client';
import {
	InteractionReplyOptions,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	MessageSelectMenu,
	MessageSelectOptionData,
} from 'discord.js';
import {
	chunk,
	filter,
	forEach,
	join,
	lowerCase,
	map,
	repeat,
	sample,
	startCase,
	toString,
} from 'lodash';
import { client } from '../discord';
import { prisma } from '../pg';
import { CURRENCY } from '../static/currency';
import { STAR_EMOJI } from '../static/emoji';
import { progressBar } from './format';
import items from '../static/items.json';
import { getItemMeta } from './items';
import { Decimal } from '@prisma/client/runtime';

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

	embed.setThumbnail(
		`https://cdn.ferris.gg/img/food/${user.character.icon}.png`
	);

	embed.setDescription(
		`**${discordUser.username}** went shopping and picked up: **${
			user.character.name
		}**\n\n*${user.character.bio}*\n\nHP: ${user.character.hp}/${
			user.character.start_hp
		}${
			user.character.stars > 0
				? `\n\nMichelin Stars: ${repeat(
						STAR_EMOJI,
						user.character.stars
				  )}`
				: ''
		}`
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
		embed
			.setDescription(
				"Error: We tried looking around and couldn't find the food you were looking for!\n\nIf you think this is an error, please let us know."
			)
			.setColor('RED');
		return embed;
	}

	embed.setThumbnail(
		`https://cdn.ferris.gg/img/food/${user.character.icon}.png`
	);

	embed.setDescription(
		`**${discordUser.username}**'s **${user.character.name}**\n\n*${
			user.character.bio
		}*\n\nHP: ${user.character.hp}/${
			user.character.start_hp
		}\n${progressBar(user.character.hp, user.character.start_hp)}${
			user.character.stars > 0
				? `\n\nMichelin Stars: ${repeat(
						STAR_EMOJI,
						user.character.stars
				  )}`
				: ''
		}\n\n${user.character.name} has battled ${
			user.character.battles
		} times and won ${
			user.character.wins
		} of those battles.\n\nCreated: ${user.character.createdDate.toLocaleDateString()}`
	);

	embed.setFooter(`${user.character.id}`);

	return embed;
};

export const userProfileEmbed = async (
	user: User & { character: Character | null; characters: Character[] }
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
			discordUser.avatarURL() ||
				'https://cdn.ferris.gg/img/placeholder.png'
		);
	} else {
		embed.setThumbnail(
			`https://cdn.ferris.gg/img/food/${user.character.icon}.png`
		);

		embed.addField(
			`Main Character: *${discordUser.username}'s ${user.character.name}*`,
			`**HP**: ${user.character.hp}/${user.character.start_hp}\n${progressBar(
				user.character.hp,
				user.character.start_hp
			)}`,
			true
		);
	}

	let winRateRound: number
	winRateRound = user.wins / user.battles
	//if (winRateRound = (undefined || NaN)) winRateRound = 0.00
	
	embed.setDescription(
		`${CURRENCY.EMOJI} **Coins**: ${user.currency}\n**Premium Subscription**: ${
			user.premium ? 'Yes' : 'None...'
		}\n**Battles**: ${user.battles} / **Wins**: ${user.wins}\n**Win Rate**: ${(winRateRound?.toFixed(2) + '%').replace('NaN%', 'Not battled yet').replace('0.', '')}\n
		**Characters**: ${join(
			map(user.characters, 'emoji'),
			' '
		)}`
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
			djsGuild.iconURL() || 'https://cdn.ferris.gg/img/placeholder.png'
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

export const charactersViewEmbed = async (
	user: User & {
		characters: Character[];
	}
) => {
	const djsUser = await client.users.fetch(user.id);
	const embed = new MessageEmbed();

	if (user.characters.length <= 0) {
		embed
			.setColor('RED')
			.setTimestamp()
			.setDescription(
				`You do not have any characters, ${djsUser.username}.`
			);
		return {
			embeds: [embed],
			components: [],
		};
	}

	const chars = [
		...filter(user.characters, 'primaryId'),
		...filter(user.characters, (c) => !c.primaryId),
	];

	embed.setColor('WHITE').setTimestamp();

	embed.setTitle(`${djsUser.username}'s Characters!`);

	let chosenChar = sample(chars);

	let desc = `*" ${chosenChar?.bio} "*`;
	desc += `\n${chosenChar?.emoji} ╯\n\n`;
	if (chars[0].primaryId)
		desc += `${djsUser} is currently battling with **${chars[0].name}**.`;

	embed.addFields(
		chars.map((char) => {
			return {
				name: `${char.emoji} ${!!char.primaryId ? '**' : ''}${
					char.name
				}${!!char.primaryId ? '**' : ''}`,
				value: `HP: ${char.hp}/${char.start_hp}`,
				inline: true,
			};
		})
	);

	embed.setDescription(desc);

	const actionMenu = new MessageActionRow();

	const selectMenu = new MessageSelectMenu();

	selectMenu.setCustomId('GETCHAR ' + user.id);
	selectMenu.setPlaceholder('Select a character to see more information');

	const charOptions: MessageSelectOptionData[] = chars.map((char) => {
		return {
			label: `${char.name}${!!char.primaryId ? ' [primary]' : ''}`,
			value: toString(char.id),
			description: char.bio,
			// default: !!char.primaryId,
			emoji: char.emoji,
		};
	});

	selectMenu.addOptions(charOptions);

	actionMenu.addComponents(selectMenu);

	return {
		embeds: [embed],
		components: [actionMenu],
	};
};

export const primaryDeadEmbed = async (
	uid: string
): Promise<InteractionReplyOptions> => {
	const user = await prisma.user.findUnique({
		where: {
			id: uid,
		},
		include: {
			character: true,
		},
	});

	const embed = new MessageEmbed();

	if (!user || !user.character) {
		embed.setTitle(
			`Error: No user or character found? How did you get this embed?`
		);

		return {
			embeds: [embed],
		};
	}

	embed.setColor('RED').setTimestamp();

	embed.setDescription(
		`**${user.character.name}** is dead and unable to battle.`
	);

	let price = user.character.start_hp - user.character.hp;

	return {
		embeds: [embed],
		components: [
			{
				type: 'ACTION_ROW',
				components: [
					{
						type: 'BUTTON',
						style: 'DANGER',
						customId: `BUYHEAL ${user.id} ${user.character.id}`,
						label: `${
							user.character.start_hp - user.character.hp
						} to fully heal ${user.character.name}`,
						emoji: CURRENCY.EMOJI,
						disabled: user.currency < price,
					},
					{
						type: 'BUTTON',
						style: 'SECONDARY',
						customId: `GETCHAR ${user.id} ${user.character.id}`,
						label: `Manage Character`,
					},
				],
			},
		],
	};
};

export const shopEmbed = (
	uid: string,
	page: number = 0,
	options: {
		itemsPerPage: number;
	} = {
		itemsPerPage: 9,
	}
): InteractionReplyOptions => {
	const pages = chunk(items, options.itemsPerPage);
	const pageItems = pages[page];

	const embed = new MessageEmbed();

	embed.setColor('WHITE').setTimestamp();
	embed.setTitle('Shop Items');

	embed.setFooter(`Page: ${page + 1} out of ${pages.length}`);

	const actionRow = new MessageActionRow();
	const selectMenu = new MessageSelectMenu();

	selectMenu.setCustomId('ITEM');
	selectMenu.setPlaceholder('Select an item for more information');

	forEach(pageItems, (item) => {
		embed.addField(
			`${item.emoji} ${item.name}`,
			`Type: ${startCase(lowerCase(item.type))}\n${CURRENCY.EMOJI} ${
				item.price
			}`,
			true
		);

		selectMenu.addOptions({
			label: item.name,
			value: item.icon,
			description: `${item.bio}`,
			emoji: item.emoji,
		});
	});

	let components = [actionRow];

	const actionRowButtons = new MessageActionRow();

	if (page > 0) {
		const button = new MessageButton();

		button.setCustomId(`SHOP ${uid} ${page - 1}`);
		button.setLabel('Last Page');
		button.setStyle('SECONDARY');

		actionRowButtons.addComponents(button);
	}

	if (page < pages.length - 1) {
		const button = new MessageButton();

		button.setCustomId(`SHOP ${uid} ${page + 1}`);
		button.setLabel('Next Page');
		button.setStyle('SECONDARY');

		actionRowButtons.addComponents(button);
	}

	if (actionRowButtons.components.length > 0) {
		components.push(actionRowButtons);
	}

	actionRow.addComponents(selectMenu);

	return {
		embeds: [embed],
		components,
	};
};

export const itemShopInspection = (item: typeof items[0]) => {
	const embed = new MessageEmbed();

	embed.setColor('WHITE').setTimestamp();
	embed.setTitle(`Item Information: ${item.name}`);
	embed.setThumbnail(`https://cdn.ferris.gg/img/items/${item.icon}.png`);
	embed.setDescription(
		`**${item.name}** is a **${lowerCase(item.type)}** item.\n\n*${
			item.bio
		}*\n\n${item.description}\n\n${getItemMeta(item)}\n\nPrice: ${
			item.price
		} ${CURRENCY.EMOJI}`
	);

	const actionRow = new MessageActionRow();

	const button = new MessageButton();

	button.setCustomId(`BUY ${item.icon} 1`);
	button.setStyle('PRIMARY');
	button.setLabel('Purchase');
	button.setEmoji(CURRENCY.EMOJI);

	actionRow.addComponents(button);

	return {
		embeds: [embed],
		components: [actionRow],
	};
};
