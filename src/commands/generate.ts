import { newPrimary } from '../database/chars';
import { commands } from '../discord';
import { generatedFood } from '../util/prefabEmbeds';

commands.set('generate', {
	run: async (interaction) => {
		const user = await newPrimary(interaction.user.id);

		if (!user.primary) {
			return interaction.reply('An error occured?');
		}

		const embed = await generatedFood(user);

		interaction.reply({ embeds: [embed] });
	},
	command: {
		name: 'generate',
		description: 'generate',
	},
});