import { MessageEmbed } from 'discord.js';
import { map, sample } from 'lodash';
import { getUserCharacters } from '../database/user';
import { commands } from '../discord';
import { COLORS } from '../util/colors';

commands.set('inv', {
	run: async (interaction) => {
		const embed = new MessageEmbed();

		const characters = await getUserCharacters(interaction.user.id);

		embed.setColor(`#${COLORS.INDIGO.LIGHT}`);
		embed.setDescription(
			`${map(
				characters,
				(char) =>
					`\`\`\`asciidoc\n${char.name}\n[ ${char.code} ]\`\`\`\n`
			).join('')}\nManage your characters using \`/character\`.`
		);
		embed.setTimestamp();
		embed.setAuthor(
			interaction.user.tag,
			interaction.user.avatarURL({ format: 'webp' }) || undefined
		);
		embed.setThumbnail(
			`https://cdn.ferris.gg/img/food/${sample(characters)?.icon}.png`
		);
		embed.setTitle(`${interaction.user.username}'s Characters`);

		interaction.reply({
			embeds: [embed],
		});
	},
	command: {
		name: 'inv',
		description: 'view your items as a member',
	},
});
