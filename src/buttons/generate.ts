import { newPrimary } from '../database/chars';
import { buttons } from '../discord';
import { deletedChar } from '../util/imagegen';
import { generatedFood } from '../util/prefabEmbeds';

buttons.set('GENERATE', {
	run: async (interaction) => {
		const user = await newPrimary(interaction.user.id);

		if (!user.primary) {
			return interaction.reply('An error occured?');
		}

		const embed = await generatedFood(user);

		interaction.update({
			embeds: [embed],
			components: [],
			content: 'Thanks!',
		});
	},
});
