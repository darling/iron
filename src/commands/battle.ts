import { commands } from '../discord';
import { getBattleMessage } from '../util/battles';

commands.set('battle', {
	run: async (interaction) => {
		const mo = await getBattleMessage(interaction.user.id);

		interaction.reply({ ...mo, ephemeral: false });
	},
	command: {
		name: 'battle',
		description: 'Battle a random food',
	},
});
