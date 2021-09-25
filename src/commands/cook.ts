import { join, map } from 'lodash';

import { newPrimary } from '../database/chars';
import { commands } from '../discord';
import { prisma } from '../pg';
import { generatedFood, onboardUserEmbed } from '../util/prefabEmbeds';

commands.set('cook', {
	run: async (interaction) => {
		const user = await prisma.user.findUnique({
			where: { id: interaction.user.id },
			include: {
				characters: true,
			},
		});

		if (!user) {
			return interaction.reply(
				await onboardUserEmbed(interaction.user.id)
			);
		}

		if (user.characters.length >= 9) {
			return interaction.reply(
				`${join(
					map(user.characters, 'emoji'),
					' '
				)}\n\nYour pantry is getting full! You need to **eat** or get rid of your food to free up space for new characters!`
			);
		}

		const char = await newPrimary(interaction.user.id);

		if (!char.owner) {
			throw 'error: no owner attached to new char?';
		}

		const embed = await generatedFood({ ...char.owner, character: char });

		interaction.reply({
			embeds: [embed],
		});
	},
	command: {
		name: 'cook',
		description: 'Get some new characters!',
		type: 'CHAT_INPUT',
	},
});
