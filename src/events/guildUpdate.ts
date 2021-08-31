import { newGuild } from '../database/guild';
import { client } from '../discord';

client.on('guildUpdate', async (_guild, guild) => {
	await newGuild(guild);
});
