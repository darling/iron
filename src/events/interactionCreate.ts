import { client, commands } from '../discord';

// Sort and categorize interactions that come in through gateway

client.on('interactionCreate', async (interaction) => {
	console.log(interaction);

	switch (interaction.type) {
		case 'APPLICATION_COMMAND': // Slash Commands and such
			if (interaction.isCommand()) {
				const command = commands.get(interaction.commandName);

				if (command) {
					command.run(interaction);
				}
			}
			break;

		case 'MESSAGE_COMPONENT': // Buttons/dropdowns
			break;

		case 'PING': // I think djs13 acks automagically
			break;
	}
});
