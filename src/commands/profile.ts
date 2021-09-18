import { commands } from '../discord';
import { prisma } from '../pg';
import { onboardUserEmbed, userProfileEmbed } from '../util/prefabEmbeds';

commands.set('profile', {
	run: async (interaction) => {
		const user = await prisma.user.findFirst({
			where: { id: interaction.user.id },
			include: {
				character: true,
				characters: true,
				kitchen: true,
			},
		});

		if (!user) {
			return interaction.reply(
				await onboardUserEmbed(interaction.user.id)
			);
		}

		const embed = await userProfileEmbed({
			...user,
			character: user.character,
			characters: user.characters,
		});

		interaction.reply({
			embeds: [embed],
		});
	},
	command: {
		name: 'profile',
		description: 'Get your profile information.',
	},
});
