import { MessageEmbed } from 'discord.js';
import { compact, join, keys, map } from 'lodash';
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

		embed.setDescription(`${join(map(items, 'emoji'), ' ')}`);
		embed.setTimestamp();
		embed.setAuthor(
			interaction.user.tag,
			interaction.user.avatarURL() || undefined
		);
		embed.setTitle(`${interaction.user.username}'s Items`);

		interaction.reply({
			embeds: [embed],
		});
	},
	command: {
		name: 'inv',
		description: 'view your items as a member',
	},
});
