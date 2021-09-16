import { commands } from '../discord';
import { prisma } from '../pg';
import { userProfileEmbed } from '../util/prefabEmbeds';

commands.set('profile', {
	run: async (interaction) => {
		const user = await prisma.user.findFirst({
			where: { id: interaction.user.id },
			include: {
				character: true,
			},
		});

		if (!user) {
			return interaction.reply({
				content: `onboarding goes here`,
			});
		}

		const embed = await userProfileEmbed({
			...user,
			character: user.character,
		});

		interaction.reply({
			content: `\`\`\`json\n${JSON.stringify(user, null, 2)}\`\`\``,
			embeds: [embed],
		});
	},
	command: {
		name: 'profile',
		description: 'Get your profile information.',
	},
});
