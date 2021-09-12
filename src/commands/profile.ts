import { newUser, setUserTeam } from '../database/user';
import { commands } from '../discord';
import { ITeam } from '../types/db';
import { issueCharacter } from '../util/characters';

commands.set('profile', {
	run: async (interaction) => {
		await newUser(interaction.user.id);
		interaction.reply('What?');
	},
	command: {
		name: 'profile',
		description: 'Get your profile information.',
	},
});
