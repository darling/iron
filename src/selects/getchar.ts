import { MessageActionRow } from 'discord.js';
import { toNumber } from 'lodash';
import { selections } from '../discord';
import { prisma } from '../pg';
import { characterViewEmbed } from '../util/prefabEmbeds';

selections.set('GETCHAR', {
	run: async (interaction) => {
		const [_, uid] = interaction.customId.split(/ +/g);
		const cid = interaction.values;

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
		} else {
			return interaction.reply({
				ephemeral: true,
				embeds: [embed],
			});
		}

		interaction.reply({
			embeds: [embed],
			components: [actionRow],
		});
	},
});
