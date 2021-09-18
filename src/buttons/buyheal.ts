import { toInteger } from 'lodash';
import { newPrimary } from '../database/chars';
import { buttons } from '../discord';
import { prisma } from '../pg';
import { deletedChar } from '../util/imagegen';
import { generatedFood } from '../util/prefabEmbeds';

buttons.set('BUYHEAL', {
	run: async (interaction) => {
		const [_, uid, cid] = interaction.customId.split(/ +/g);

		if (uid != interaction.user.id) {
			return interaction.reply({
				ephemeral: true,
				content: 'Hey, this button was not meant for you.',
			});
		}

		const user = await prisma.user.findUnique({
			where: {
				id: interaction.user.id,
			},
			include: {
				character: true,
			},
		});

		if (!user || !user.character) {
			return interaction.reply({
				ephemeral: true,
				content:
					'Error: User or Character does not exist, how did you get here?',
			});
		}

		if (user.character.hp > 0) {
			return interaction.reply({
				ephemeral: true,
				content: 'Your character is alive still!',
			});
		}

		if (user.currency < user.character.start_hp) {
			return interaction.reply({
				ephemeral: true,
				content: 'You can not afford to heal this character!',
			});
		}

		await prisma.user.update({
			data: {
				currency: toInteger(user.currency - user.character.start_hp),
			},
			where: {
				id: uid,
			},
		});

		await prisma.character.update({
			data: {
				hp: user.character.start_hp,
			},
			where: {
				id: user.character.id,
			},
		});

		interaction.update({
			embeds: [
				{
					description: `**${user.character.name}** has been fully healed!\n\n*" yay! "*\n${user.character.emoji} ╯`,
					color: 'GREEN',
				},
			],
			components: [],
		});
	},
});
