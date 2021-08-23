import { client, commands } from '../discord';

commands.set('register', {
	run: async (interaction) => {
		const name = interaction.options.getString('name', true);
		if (!name) return;

		const entry = commands.get(name);

		entry &&
			client.application?.commands.create(
				entry.command,
				'810987789847101491'
			);

		interaction.reply('ACK');
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
