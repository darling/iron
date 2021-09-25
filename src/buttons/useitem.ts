import { MessageEmbed } from 'discord.js';
import { toNumber } from 'lodash';

import { eatChar } from '../database/chars';
import { takeItem } from '../database/shops';
import { buttons } from '../discord';
import { prisma } from '../pg';
import { getItem, getItemUse } from '../util/items';

buttons.set('USEITEM', {
	run: async (interaction) => {
		const [_, uid, iid] = interaction.customId.split(/ +/g);

		if (uid != interaction.user.id) {
			return interaction.reply({
				ephemeral: true,
				content: 'Hey, this button was not meant for you.',
			});
		}

		const embed = new MessageEmbed();

		const user = await prisma.user.findUnique({
			where: { id: uid },
			include: { character: true },
		});

		if (!user) {
			embed
				.setColor('RED')
				.setTimestamp()
				.setDescription(`Error: No user`);

			return interaction.update({
				embeds: [embed],
				components: [],
			});
		}

		if (user.character === null) {
			embed
				.setColor('RED')
				.setTimestamp()
				.setDescription(
					`Error: Make sure you have a primary character selected!`
				);

			return interaction.update({
				embeds: [embed],
				components: [],
			});
		}

		const item = getItem(iid);
		const results = await takeItem(user, iid);

		user.inventory = results.user.inventory;

		const use = getItemUse(item);

		if (results.status && use) {
			const output = await use(
				{ ...user, character: user.character },
				item
			);

			embed
				.setColor('WHITE')
				.setTimestamp()
				.setDescription(
					`${interaction.user.username} used ${item.emoji} **${
						item.name
					}**${output || ''}`
				);

			interaction.update({
				embeds: [embed],
				components: [],
			});
		} else {
			embed
				.setColor('RED')
				.setTimestamp()
				.setDescription(
					`${item.emoji} **${item.name}** was unable to be used. Do you even have this item?`
				);

			interaction.update({
				embeds: [embed],
				components: [],
			});
		}
	},
});
