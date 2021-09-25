import { MessageEmbed } from 'discord.js';
import { toNumber } from 'lodash';

import { eatChar } from '../database/chars';
import { buttons } from '../discord';

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

		const embed = new MessageEmbed();

		embed
			.setColor('WHITE')
			.setTimestamp()
			.setDescription(`${char.emoji} **${char.name}** was eaten!`);

		interaction.update({
			embeds: [embed],
			components: [],
		});
	},
});
