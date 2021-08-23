import { Client, Intents } from 'discord.js';
import { join } from 'path';

import { IButton, ICommand } from './types/db';
import { requireDirectory } from './util/importing';

// Globals for Discord Client

export const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
export const commands = new Map<string, ICommand>();
export const buttons = new Map<string, IButton>();

// Imports

const imports = ['events', 'commands', 'buttons'];
imports.forEach((item) => requireDirectory(join(__dirname, item)));

// Login

client.login(process.env.DISCORD_TOKEN);
