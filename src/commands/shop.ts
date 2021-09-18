import { MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js';
import { giveItem, takeItem } from '../database/shops';
import { commands } from '../discord';
import { prisma } from '../pg';
import { COLORS } from '../util/colors';
import { shopEmbed } from '../util/prefabEmbeds';

commands.set('shop', {
	run: async (interaction) => {
		// const user = await prisma.user.findUnique({
		// 	where: { id: interaction.user.id },
		// });

		// if (!user) {
		// 	return interaction.reply('d');
		// }
		interaction.reply(await shopEmbed(interaction.user.id));
	},
	command: {
		name: 'shop',
		description: 'View shop items.',
		type: 'CHAT_INPUT',
	},
});
