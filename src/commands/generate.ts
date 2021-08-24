import { setUserTeam } from '../database/user';
import { commands } from '../discord';
import { ITeam } from '../types/db';
import { issueCharacter } from '../util/characters';

commands.set('generate', {
	run: async (interaction) => {
		const team: ITeam = {
			first: issueCharacter(),
			second: issueCharacter(),
		};

		await setUserTeam(interaction.user.id, team);

		interaction.reply(
			`${team.first.name} and ${team.second.name} are now your friends...`
		);
	},
	command: {
		name: 'generate',
		description: 'generate a set of primary and secondary',
	},
});
