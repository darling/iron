import { getUser } from '../database/user';
import { commands } from '../discord';
import { userProfileEmbed } from '../util/prefabEmbeds';

commands.set('profile', {
	run: async (interaction) => {
		const user = await getUser(interaction.user.id);

		const embed = await userProfileEmbed(user);

		interaction.reply({
			content: `\`\`\`json\n${JSON.stringify(user, null, 2)}\`\`\``,
			embeds: [embed],
		});
	},
	command: {
		name: 'profile',
		description: 'Get your profile information.',
	},
});
