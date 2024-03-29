import { client, commands } from '../discord';

commands.set('register', {
	run: async (interaction) => {
		const name = interaction.options.getString('name', true);
		if (!name) return;

		if (interaction.user.id !== '534165671651573781') {
			await interaction.reply("You're not @loom");
			return;
		}

		const entry = commands.get(name);

		if (entry) {
			if (interaction.guildId) {
				client.application?.commands.create(
					entry.command,
					interaction.guildId
				);
			} else {
				client.application?.commands.create(entry.command);
			}
		}

		await interaction.reply('Interaction registered');
	},
	command: {
		name: 'register',
		description: 'Developer only: Reregister commands within the bot',
		options: [
			{
				name: 'commandname',
				type: 'STRING',
				description: 'name of the command to repost',
				required: true,
			},
		],
	},
});
