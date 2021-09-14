import { newPrimary } from '../database/chars';
import { getGuild } from '../database/guild';
import { commands } from '../discord';
import { generatedFood, guildProfileEmbed } from '../util/prefabEmbeds';

commands.set('guild', {
	run: async (interaction) => {
		if (!interaction.inGuild()) {
			return interaction.reply('Hey! This is a guild only command!');
		}

		const guild = await getGuild(interaction.guildId);

		if (!guild) {
			return interaction.reply({
				content: `\`\`\`Guild not found, how is this possible?\`\`\``,
			});
		}

		const embed = await guildProfileEmbed(guild);

		interaction.reply({
			content: `\`\`\`json\n${JSON.stringify(guild, null, 2)}\`\`\``,
			embeds: [embed],
		});
	},
	command: {
		name: 'guild',
		description: 'View guild info',
	},
});
