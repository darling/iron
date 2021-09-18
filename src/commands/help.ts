import { MessageEmbed } from 'discord.js';
import { commands } from '../discord';
import { prisma } from '../pg';
import { COLORS } from '../util/colors';

commands.set('help', {
	run: async (interaction) => {
		const embed = new MessageEmbed();
		embed.setColor(`#${COLORS.INDIGO.PURE}`);
		embed.setDescription(
			'Ferris is a high-caliber community bot used to improve Discord servers and help communities grow.'
		);
		embed.setTitle('Need help using Ferris?');
		interaction.reply({
			embeds: [embed],
			components: [
				{
					type: 'ACTION_ROW',
					components: [
						{
							type: 'BUTTON',
							style: 'LINK',
							label: 'Our website',
							url: 'https://ferris.gg/',
						},
					],
				},
			],
		});
	},
	command: {
		name: 'help',
		description: 'Get information on how to use Ferris.',
		type: 'CHAT_INPUT',
	},
});
