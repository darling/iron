import { toNumber } from 'lodash';
import { eatChar, newPrimary } from '../database/chars';
import { buttons } from '../discord';
import { deletedChar } from '../util/imagegen';
import { generatedFood } from '../util/prefabEmbeds';

buttons.set('EAT', {
	run: async (interaction) => {
		const [_, uid, cid] = interaction.customId.split(/ +/g);

		if (uid != interaction.user.id) {
			return interaction.reply({
				ephemeral: true,
				content: 'Hey, this button was not meant for you.',
			});
		}

		const char = await eatChar(toNumber(cid));

		interaction.update({
			content: `${char.emoji} **${char.name}** was eaten!`,
			embeds: [],
			components: [],
		});
	},
});
