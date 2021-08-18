import { client } from '../discord';

client.on('ready', (client) => {
	console.log(`Logged in as ${client.user.tag}!`);
});
