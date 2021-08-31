import { newGuild } from '../database/guild';
import { client } from '../discord';

client.on('ready', (client) => {
	const { user, guilds } = client;
	if (!user) throw Error('User is undefined but bot is ready?');

	console.log(`Logged in as ${client.user.tag}!`);

	user.setActivity('ferris.gg', {
		type: 'PLAYING',
	});

	guilds.cache.forEach(async (guild) => {
		await newGuild(guild);
	});
});
