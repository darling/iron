import { commands } from '../discord';

commands.set('mint', {
	run: async (interaction) => {
		interaction.reply('ack');
	},
	command: {
		name: 'mint',
		description: 'view your items as a member',
		options: [
			{
				name: 'name',
				description: 'The name of the Character',
				type: 'STRING',
				required: false,
			},
		],
	},
});
