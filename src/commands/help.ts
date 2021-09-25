import { MessageEmbed } from 'discord.js';
import { join, map, sampleSize } from 'lodash';

import { commands } from '../discord';
import charList from '../static/chars.json';

commands.set('help', {
	run: async (interaction) => {
		const embed = new MessageEmbed();
		embed.setColor('WHITE');

		embed.setDescription(
			`Ferris is a yummy way to enhance your Discord server! Food fights and Kitchen wars will rally your community to fight against food!\n\n${join(
				map(sampleSize(charList, 8), 'emoji'),
				' '
			)}`
		);

		embed.setImage(`https://cdn.ferris.gg/img/food-bar-two.png`);
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
