import { commands } from '../discord';
import { generateTeamView } from '../util/imagegen';

commands.set('team', {
	run: async (interaction) => {
		// const user = await getUser(interaction.user.id);
		// const userTeam = {
		// 	first: user?.primary,
		// };
		// if (!userTeam.first || !userTeam.second) {
		// 	interaction.reply(`\`\`\`json\n"No team found"\`\`\``);
		// 	return;
		// }
		// await interaction.deferReply();
		// let team = userTeam;
		// const buffer = await generateTeamView(team);
		// await interaction.editReply({
		// 	content: `\`\`\`json\n${JSON.stringify(userTeam, null, 2)}\`\`\``,
		// 	files: [buffer],
		// });
	},
	command: {
		name: 'team',
		description: 'View your team',
	},
});
