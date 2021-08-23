import {
	MessageActionRow,
	MessageActionRowOptions,
	MessageEmbed,
} from 'discord.js';

import { getUserCharacter } from '../database/user';
import { commands } from '../discord';
import { COLORS } from '../util/colors';
import { genCharProfile } from '../util/imagegen';

commands.set('character', {
	run: async (interaction) => {
		const embed = new MessageEmbed();
		const charcode = interaction.options.getString('charcode', true);
		const character = await getUserCharacter(interaction.user.id, charcode);

		embed.setColor(`#${COLORS.INDIGO.PURE}`);

		if (!character) {
			embed.setTitle('Error');
			embed.setDescription('Character does not exist.');

			return interaction.reply({
				embeds: [embed],
			});
		}

		let files = [];

		const buffer = await genCharProfile(character);

		if (buffer) {
			files.push(buffer);
		}

		embed.setTitle(character.name);
		embed.setDescription(`${character.bio}\n\n\`${character.class}\``);
		embed.setThumbnail(
			`https://cdn.ferris.gg/img/food/${character.icon}.png`
		);

		let components: (MessageActionRow | MessageActionRowOptions)[] = [];

		if (!interaction.inGuild()) {
			components = [
				{
					type: 'ACTION_ROW',
					components: [
						{
							type: 'BUTTON',
							style: 'DANGER',
							label: 'Consume',
							customId: `CHARDEL ${character.code}`,
						},
					],
				},
			];
		} else {
			embed.setFooter('To manage this character, use /character in DM.');
		}

		interaction.reply({
			files,
			embeds: [embed],
			components,
		});
	},
	command: {
		name: 'character',
		description: 'Manage and look at your characters.',
		type: 'CHAT_INPUT',
		options: [
			{
				name: 'charcode',
				description: 'The code your character has in /inventory',
				type: 'STRING',
				required: true,
			},
		],
	},
});
