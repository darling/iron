import { Client, Intents } from 'discord.js';
import { join } from 'path';

import { ICommand } from './types/db';
import { requireDirectory } from './util/importing';

// Globals for Discord Client

export const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
export const commands = new Map<string, ICommand>();

// Imports

const imports = ['events', 'commands'];
imports.forEach((item) => requireDirectory(join(__dirname, item)));

// Login

client.login(process.env.DISCORD_TOKEN);
