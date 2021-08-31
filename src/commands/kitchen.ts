import { CommandInteraction, Interaction, Permissions } from 'discord.js';
import { setGuild } from '../database/guild';
import { commands } from '../discord';
import { firebaseAdmin } from '../util/firebase';

const subcommands = new Map<
	string,
	(interaction: CommandInteraction, subCommand: string) => any
>();

subcommands.set('general', (interaction, subCommand) => {});

subcommands.set('channel', (interaction, subCommand) => {});

subcommands.set('balance', (interaction, subCommand) => {});

subcommands.set('admin', async (interaction, subCommand) => {
	const perms = interaction.member?.permissions;

	if (!perms || interaction.guildId === null || typeof perms == 'string') {
		return await interaction.reply(
			'Kitchen Management is for Admins of Guilds Only!'
		);
	}

	const isAdmin = perms.has(Permissions.FLAGS.ADMINISTRATOR);

	if (!isAdmin) {
		return await interaction.reply(
			'Kitchen Management is for Admins of Guilds Only!'
		);
	}

	switch (subCommand) {
		case 'register':
			setGuild(interaction.guildId, {
				registered: true,
				name: interaction.guild?.name,
				icon: interaction.guild?.icon || undefined,
			});
			return await interaction.reply(
				'Guild Registered! Read our guide on how to setup your own kitchen! ()'
			);

		default:
			break;
	}
});

commands.set('kitchen', {
	run: async (interaction) => {
		const subCommandGroup = interaction.options.getSubcommandGroup();
		const subCommand = interaction.options.getSubcommand();

		const user = interaction.member;

		if (user === null) {
			return await interaction.reply(
				'Kitchen Management is for Guilds Only!'
			);
		}

		console.log('kitchen', subCommandGroup, subCommand);

		const run = subcommands.get(subCommandGroup);

		if (run) {
			await run(interaction, subCommand);
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
