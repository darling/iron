import express from 'express';
import { getGuild } from './database/guild';
import { getUser } from './database/user';

const api = express();

api.get('/users/:uid', async (req, res) => {
	const user = await getUser(req.params.uid);
	res.json(user);
});

api.get('/guilds/:id', async (req, res) => {
	const guild = await getGuild(req.params.id, ['owner', 'users']);
	res.json(guild);
});

api.listen(process.env.API_PORT || 8008);
