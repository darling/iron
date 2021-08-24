import {
	ApplicationCommandData,
	ButtonInteraction,
	CommandInteraction,
} from 'discord.js';

export interface ICommand {
	run: (interaction: CommandInteraction) => any;
	command: ApplicationCommandData;
	needsProfile?: boolean;
	permissionLevels?: IPermissionLevels[];
}

export interface IButton {
	run: (interaction: ButtonInteraction) => any;
}

export enum IPermissionLevels {
	DEVELOPER,
	ADMIN,
	MODERATOR,
}

export interface IUser {
	premium?: boolean;
	perm?: IPermissionLevels[];
	currency?: number;
	primary?: ICharacter;
	secondary?: ICharacter;
	summonCrystals?: number;
	characters?: ICharacter[];
}

export interface ITeam {
	first: ICharacter;
	second: ICharacter;
}

export interface ICharacter {
	hp: number;
	startHp: number;
	name: string;
	class: 'TANK' | 'ADC' | 'MAGE';
	stats: {
		str: number;
		mag: number;
		int: number;
		luc: number;
		end: number;
		swi: number;
	};
	icon: string;
	pairings?: string[];
	bio: string;
	code: string;
	nickname?: string;
	wins?: number;
	battles?: number;
}
