import { giveItem } from '../database/shops';
import { buttons, client } from '../discord';
import { prisma } from '../pg';
import { getItem } from '../util/items';
import { Prisma } from '.prisma/client';
import { MessageEmbed } from 'discord.js';
import { CURRENCY } from '../static/currency';
import { repeat, toNumber } from 'lodash';
import { BLANK_EMOJI } from '../static/emoji';

buttons.set('BUY', {
	run: async (interaction) => {
		const [_, icon, amount] = interaction.customId.split(/ +/g);

		const item = getItem(icon);

		if (!item) {
			return interaction.reply({
				content: "Error: I don't know what this item is?",
				ephemeral: true,
			});
		}

		const user = await prisma.user.findUnique({
			where: {
				id: interaction.user.id,
			},
		});

		if (user == null) {
			return interaction.reply({
				embeds: [
					{
						title: 'Error: No user found',
					},
				],
			});
		}

		if (item.price > user.currency) {
			return interaction.reply({
				embeds: [
					{
						title: "You can't afford this item!",
					},
				],
				ephemeral: true,
			});
		} else {
			const { inventory } = await giveItem(user, item.icon, {
				amount: toNumber(amount),
				write: false,
			});

			await prisma.user.update({
				data: {
					currency: {
						decrement: item.price * toNumber(amount),
					},
					inventory: inventory as Prisma.JsonObject,
				},
				where: {
					id: interaction.user.id,
				},
			});

			const djsUser = await client.users.fetch(user.id);

			const embed = new MessageEmbed();

			embed.setColor('WHITE').setTimestamp();

			embed.setTitle(`Item Delivery for ${djsUser.username}!`);
			embed.setDescription(
				`${toNumber(amount)} × ${item.emoji} ${item.name}\n\n${repeat(
					BLANK_EMOJI,
					1
				)}${CURRENCY.EMOJI} ${
					item.price * toNumber(amount)
				}\n\nThank you for your purchase.`
			);

			return interaction.reply({
				embeds: [embed],
			});
		}
	},
});
