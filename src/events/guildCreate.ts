import { newGuild, setGuild } from '../database/guild';
import { client } from '../discord';

client.on('guildCreate', async (guild) => {
	await newGuild(guild);
});
