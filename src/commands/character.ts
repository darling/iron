import { commands } from '../discord';
import { prisma } from '../pg';
import { characterViewEmbed, onboardUserEmbed } from '../util/prefabEmbeds';

commands.set('character', {
	run: async (interaction) => {
		const user = await prisma.user.findUnique({
			where: { id: interaction.user.id },
			include: {
				character: true,
			},
		});

		if (!user) {
			return interaction.reply(
				await onboardUserEmbed(interaction.user.id)
			);
		}

		interaction.reply({ embeds: [await characterViewEmbed(user)] });
	},
	command: {
		name: 'character',
		description: 'Look at your current character!',
		type: 'CHAT_INPUT',
		options: [],
	},
});
