import { CommandInteraction, Interaction } from 'discord.js';
import { commands } from '../discord';

const subcommands = new Map<string, (interaction: CommandInteraction) => any>();

subcommands.set('general', (interaction) => {});

subcommands.set('channel', (interaction) => {});

subcommands.set('balance', (interaction) => {});

subcommands.set('admin', (interaction) => {});

commands.set('kitchen', {
	run: async (interaction) => {
		const subCommandGroup = interaction.options.getSubcommandGroup();
		const subCommand = interaction.options.getSubcommand();

		console.log('kitchen', subCommandGroup, subCommand);

		const run = subcommands.get(subCommandGroup);

		if (run) {
			await run(interaction);
		} else {
			await interaction.reply('Error!');
		}
	},
	command: {
		name: 'kitchen',
		description: 'Basic Kitchen management.',
		type: 'CHAT_INPUT',
		options: [
			{
				name: 'general',
				description: 'General Options',
				type: 'SUB_COMMAND_GROUP',
				options: [
					{
						name: 'rename',
						description: 'Rename the Kitchen',
						type: 'SUB_COMMAND',
					},
				],
			},
			{
				name: 'channel',
				description: "The Kitchen's Channel Options",
				type: 'SUB_COMMAND_GROUP',
				options: [
					{
						name: 'set',
						description: "Set the kitchen's Channel",
						type: 'SUB_COMMAND',
						options: [
							{
								name: 'channel',
								description:
									'The specified Channel. If no channel is given then the invoked channel is set.',
								type: 'CHANNEL',
								required: false,
							},
						],
					},
					{
						name: 'clear',
						description: 'Reset to no bonus channel',
						type: 'SUB_COMMAND',
					},
				],
			},
			{
				name: 'balance',
				description: "The Kitchen's Bank",
				type: 'SUB_COMMAND_GROUP',
				options: [
					{
						name: 'view',
						description:
							"Get the overview for the Kitchen's information",
						type: 'SUB_COMMAND',
					},
				],
			},
			{
				name: 'admin',
				description: 'Server Only Commands',
				type: 'SUB_COMMAND_GROUP',
				options: [
					{
						name: 'register',
						description:
							"If your Server isn't Registered in the Kitchen program. You can do that here.",
						type: 'SUB_COMMAND',
					},
					{
						name: 'reset',
						description: 'Reset the Kitchen stats',
						type: 'SUB_COMMAND',
					},
				],
			},
		],
	},
});
