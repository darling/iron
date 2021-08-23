import { deleteUserCharacterFromCode } from '../database/user';
import { buttons } from '../discord';
import { deletedChar } from '../util/imagegen';

buttons.set('CHARDEL', {
	run: async (interaction) => {
		console.log('I WANT TO DELETE', interaction.customId);

		const code = interaction.customId.split(/ +/g).pop() || 'undefined';

		const oldChar = await deleteUserCharacterFromCode(
			interaction.user.id,
			code
		);

		let files = [];

		if (oldChar) {
			const buffer = await deletedChar(oldChar);
			files.push(buffer);
		}

		interaction.update({ embeds: [], files, components: [] });
	},
});
