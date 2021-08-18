import { ApplicationCommandData, CommandInteraction } from 'discord.js';

export interface ICommand {
	run: (interaction: CommandInteraction) => any;
	command: ApplicationCommandData;
	needsProfile?: boolean;
	permissionLevels?: IPermissionLevels[];
}

export enum IPermissionLevels {
	DEVELOPER,
	ADMIN,
	MODERATOR,
	PLAYER,
}

export interface IUser {
	score?: number;
}
