import { MessageActionRow } from 'discord.js';
import { toNumber } from 'lodash';
import { buttons } from '../discord';
import { prisma } from '../pg';
import { characterViewEmbed } from '../util/prefabEmbeds';

buttons.set('GETCHAR', {
	run: async (interaction) => {
		const [_, uid, cid] = interaction.customId.split(/ +/g);

		const user = await prisma.user.findFirst({
			where: {
				id: uid,
			},
		});

		if (user == null) {
			return interaction.reply({
				embeds: [
					{
						title: 'Error: No user found',
					},
				],
			});
		}

		const character = await prisma.character.findFirst({
			where: {
				id: toNumber(cid),
			},
		});

		const embed = await characterViewEmbed({ ...user, character });

		const actionRow = new MessageActionRow();

		if (character) {
			if (!character.primaryId) {
				actionRow.addComponents({
					type: 'BUTTON',
					style: 'SECONDARY',
					label: `Make Primary`,
					customId: `PRIMARY ${user.id} ${character.id}`,
				});
			}

			actionRow.addComponents({
				type: 'BUTTON',
				style: 'DANGER',
				label: `Eat ${character?.name}`,
				customId: `EAT ${user.id} ${character.id}`,
			});
		}

		interaction.update({
			embeds: [embed],
			components: [actionRow],
		});
	},
});
