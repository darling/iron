import { MessageEmbed } from 'discord.js';
import { sum, values } from 'lodash';
import { addCharacterToUser } from '../database/user';

import { commands } from '../discord';
import { issueCharacter } from '../util/characters';
import { COLORS } from '../util/colors';

commands.set('mint', {
	run: async (interaction) => {
		const embed = new MessageEmbed();

		const character = issueCharacter(
			interaction.options.getString('name') || undefined
		);

		embed.setColor(`#${COLORS.GREEN.LIGHT}`);
		embed.setDescription(
			`\`Total stats: ${sum(
				values(character.stats)
			)}\`\n\n\`\`\`json\n${JSON.stringify(character, null, 2)}\`\`\``
		);
		embed.setThumbnail(
			`https://cdn.ferris.gg/img/food/${character.icon}.png`
		);
		embed.setTitle(`${interaction.user.username}'s New Character`);

		addCharacterToUser(interaction.user.id, character);

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
				required: false,
			},
		],
	},
});
