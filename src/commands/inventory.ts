import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { chunk, compact, forEach, get, join, keys, map } from 'lodash';
import { commands } from '../discord';
import { prisma } from '../pg';
import { getItem } from '../util/items';
import { onboardUserEmbed } from '../util/prefabEmbeds';

commands.set('inv', {
	run: async (interaction) => {
		const user = await prisma.user.findUnique({
			where: { id: interaction.user.id },
		});

		if (!user) {
			return await onboardUserEmbed(interaction.user.id);
		}

		const embed = new MessageEmbed();

		const items = compact(map(keys(user.inventory), getItem));

		const components: MessageActionRow[] = [];

		forEach(chunk(items, 5), (row) => {
			const actionRow = new MessageActionRow();

			forEach(row, (item) => {
				const button = new MessageButton();

				button.setEmoji(item.emoji);
				button.setLabel(`${get(user.inventory, item.icon)}`);
				button.setCustomId(`USEITEM ${user.id} ${item.icon}`);
				button.setStyle('SECONDARY');

				actionRow.addComponents(button);
			});

			components.push(actionRow);
		});

		embed.setDescription(
			`${join(map(items, 'emoji'), ' ')}\n\nClick an item to use it.`
		);
		embed.setTimestamp();
		embed.setAuthor(
			interaction.user.tag,
			interaction.user.avatarURL() || undefined
		);
		embed.setTitle(`${interaction.user.username}'s Items`);

		interaction.reply({
			embeds: [embed],
			components,
		});
	},
	command: {
		name: 'inv',
		description: 'view your items as a member',
	},
});
