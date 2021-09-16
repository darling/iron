import { MessageEmbed } from 'discord.js';
import { buttons, client } from '../discord';
import { prisma } from '../pg';
import { deletedChar } from '../util/imagegen';

buttons.set('NEWUSER', {
	run: async (interaction) => {
		const exists = await prisma.user.findFirst({
			where: { id: interaction.user.id },
		});

		if (exists != null) {
			return interaction.reply({
				ephemeral: true,
				content: 'You have already registered!',
			});
		}

		await prisma.user.upsert({
			create: {
				id: interaction.user.id,
			},
			update: {
				id: interaction.user.id,
			},
			where: {
				id: interaction.user.id,
			},
		});

		const user = await client.users.fetch(interaction.user.id);
		const channel = await user.createDM();

		const embed = new MessageEmbed();

		embed
			.setColor('WHITE')
			.setTimestamp()
			.setTitle('Welcome to Ferris.gg!')
			.setDescription(
				`Thank you for signing up for Ferris, **${user.username}**!\n\nFeel free to check out our website and documentation for what our bot has to offer for you as a player or guild owner:\n\nhttps://ferris.gg/\n\nFerris is a pet project of mine and I work hard on it almost every day. Feel free to jump into [Our Discord](https://ferris.gg/discord) and say "Hi" or leave some feedback!\n\nThanks,\nSafe#0001`
			)
			.setImage('https://i.imgur.com/YYlN4QW.png');

		channel.send({
			embeds: [embed],
		});

		interaction.deferUpdate();
	},
});
