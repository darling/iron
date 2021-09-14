import { newGuild } from '../database/guild';
import { client } from '../discord';

client.on('guildCreate', async (guild) => {
	console.log(guild.id, guild.name, guild.icon);
	await newGuild(guild);
});
