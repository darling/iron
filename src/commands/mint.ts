import { Interaction } from 'discord.js';
import { Character } from '../database/models/Character';
import { getUser, setUserByUser } from '../database/user';
import { commands } from '../discord';

commands.set('mint', {
	run: async (interaction) => {
		// const character = new Character();
		const user = await getUser(interaction.user.id);
		const char = new Character();

		user.primary = char;
		char.user = user;

		await setUserByUser(user);

		interaction.reply('ACK');
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
