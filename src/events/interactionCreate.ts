import { buttons, client, commands, selections } from '../discord';

// Sort and categorize interactions that come in through gateway

client.on('interactionCreate', async (interaction) => {
	if (interaction.isCommand()) {
		console.log(interaction.commandName);
		const command = commands.get(interaction.commandName);

		if (command) {
			command.run(interaction);
		}
	}

	if (interaction.isButton()) {
		console.log(interaction.customId);
		if (interaction.customId) {
			const buttonIdentifier = interaction.customId.split(/ +/g)[0];
			const button = buttons.get(buttonIdentifier);

			button && button.run(interaction);
		}
	}

	if (interaction.isSelectMenu()) {
		console.log(interaction.customId);
		if (interaction.customId) {
			const selectIdentifier = interaction.customId.split(/ +/g)[0];
			const select = selections.get(selectIdentifier);

			select && select.run(interaction);
		}
	}
});
