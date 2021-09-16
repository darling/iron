import { newPrimary } from '../database/chars';
import { buttons } from '../discord';
import { deletedChar } from '../util/imagegen';
import { generatedFood } from '../util/prefabEmbeds';

buttons.set('GENERATE', {
	run: async (interaction) => {
		const char = await newPrimary(interaction.user.id);

		if (!char.owner) {
			throw 'error: no owner attached to new char?';
		}

		const embed = await generatedFood({ ...char.owner, character: char });

		interaction.update({
			embeds: [embed],
			components: [],
			content: 'Thanks!',
		});
	},
});
