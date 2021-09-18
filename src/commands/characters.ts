import { commands } from '../discord';
import { prisma } from '../pg';
import { charactersViewEmbed, onboardUserEmbed } from '../util/prefabEmbeds';

commands.set('characters', {
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

		interaction.reply(await charactersViewEmbed(user));
	},
	command: {
		name: 'characters',
		description: 'Look at your current characters!',
		type: 'CHAT_INPUT',
		options: [],
	},
});
