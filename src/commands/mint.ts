import { MessageEmbed } from 'discord.js';
import { commands } from '../discord';
import { COLORS } from '../util/colors';

commands.set('mint', {
	run: async (interaction) => {
		const embed = new MessageEmbed();

		embed.setColor(`#${COLORS.INDIGO.LIGHT}`);
		embed.setDescription('Nothing to show here.');
		embed.setTitle(`${interaction.user.username}'s Items`);

		interaction.reply({
			embeds: [embed],
		});
	},
	command: {
		name: 'mint',
		description: 'view your items as a member',
		options: [
			{
				name: 'name',
				description: 'The name of the Character',
				type: 'STRING',
				required: true,
			},
		],
	},
});
