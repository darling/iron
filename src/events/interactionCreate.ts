import { buttons, client, commands } from '../discord';

// Sort and categorize interactions that come in through gateway

client.on('interactionCreate', async (interaction) => {
	console.log(interaction);

	if (interaction.isCommand()) {
		const command = commands.get(interaction.commandName);

		if (command) {
			command.run(interaction);
		}
	}

	if (interaction.isButton()) {
		if (interaction.customId) {
			const buttonIdentifier = interaction.customId.split(/ +/g)[0];
			const button = buttons.get(buttonIdentifier);

			button && button.run(interaction);
		}
	}
});
