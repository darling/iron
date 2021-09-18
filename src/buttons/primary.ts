import { toNumber } from 'lodash';
import { eatChar } from '../database/chars';
import { buttons } from '../discord';
import { prisma } from '../pg';

buttons.set('PRIMARY', {
	run: async (interaction) => {
		const [_, uid, cid] = interaction.customId.split(/ +/g);

		if (uid != interaction.user.id) {
			return interaction.reply({
				ephemeral: true,
				content: 'Hey, this button was not meant for you.',
			});
		}

		const char = await prisma.character.update({
			data: {
				primary: {
					connect: {
						id: uid,
					},
				},
			},
			where: {
				id: toNumber(cid),
			},
		});

		interaction.update({
			content: `${char.emoji} **${char.name}** is in gear to battle!`,
			embeds: [],
			components: [],
		});
	},
});
