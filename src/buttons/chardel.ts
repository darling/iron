import { buttons } from '../discord';
import { deletedChar } from '../util/imagegen';

buttons.set('CHARDEL', {
	run: async (interaction) => {
		console.log('I WANT TO DELETE', interaction.customId);
		const code = interaction.customId.split(/ +/g).pop() || 'undefined';

		interaction.update({ embeds: [], components: [] });
	},
});
