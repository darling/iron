import { MessageEmbed } from 'discord.js';

import { battle } from '../database/battles';
import { buttons } from '../discord';
import { CURRENCY } from '../static/currency';
import { progressBar } from '../util/format';

buttons.set('BATTLE', {
	run: async (interaction) => {
		const [_b, uid, label] = interaction.customId.split(/ +/g);

		if (uid != interaction.user.id) {
			return interaction.reply({
				ephemeral: true,
				content: 'Hey, this battle was not meant for you.',
			});
		}

		console.log(
			'SOMEONE BATTLED THAT BITCH LETS GOO',
			interaction.customId
		);

		const results = await battle(interaction.user.id, interaction);

		if (!results || !results.user.character) {
			return; // NULL CHECK
		}

		const embed = new MessageEmbed();

		embed
			.setTimestamp()
			.setAuthor(
				interaction.user.username,
				interaction.user.avatarURL() ||
					'https://ferris.gg/img/placeholder.png'
			)
			.setColor(results.winner ? 'GREEN' : 'RED')
			.setThumbnail(
				`https://ferris.gg/img/food/${results.enemy.icon}.png`
			);

		let desc = `**${interaction.user.username}**'s **${
			results.user.character.name
		}** battled **${results.enemy.name}** and ${
			results.winner ? 'won' : 'lost'
		}!`;

		desc += '\n\n';

		if (results.winner) {
			desc += `**Items Gained:**\n+ ${results.earnedCurrency} ${CURRENCY.EMOJI}`;
		} else {
			desc += 'You suck';
		}

		embed.setDescription(desc);

		embed.addField(
			`${interaction.user.username}'s ${results.user.character.name}`,
			`HP: ${results.user.character.hp}/${
				results.user.character.start_hp
			}\n${progressBar(
				results.user.character.hp,
				results.user.character.start_hp
			)}`,
			true
		);

		embed.addField(
			`${results.enemy.name}`,
			`HP: ${results.enemy.hp}/${results.enemy.start_hp}\n${progressBar(
				results.enemy.hp,
				results.enemy.start_hp
			)}`,
			true
		);

		await interaction.update({
			embeds: [embed],
			components: [],
		});
	},
});
