import { newPrimary } from '../database/chars';
import { commands } from '../discord';
import { prisma } from '../pg';
import { generatedFood, onboardUserEmbed } from '../util/prefabEmbeds';

commands.set('generate', {
	run: async (interaction) => {
		const user = await prisma.user.findUnique({
			where: { id: interaction.user.id },
		});

		if (!user) {
			return interaction.reply(
				await onboardUserEmbed(interaction.user.id)
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
		name: 'generate',
		description: 'generate',
	},
});
