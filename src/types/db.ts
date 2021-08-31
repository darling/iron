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

export interface IGuild {
	name: string;
	icon?: string;
	registered?: boolean;
	nonAdminCanEditPerms?: boolean;
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

export interface IPreMintCharacter {
	id: number;
	name: string;
	class: 'TANK' | 'ADC' | 'MAGE';
	stats: {
		id: number;
		name: string;
		strength: number;
		magic: number;
		intellect: number;
		endurance: number;
		swiftness: number;
	};
	categories?: { id: number; name: string }[];
	icon: string;
	bio: string;
}

export interface ICharacter extends IPreMintCharacter {
	hp: number;
	startHp: number;
	stats: {
		id: number;
		name: string;
		strength: number;
		magic: number;
		intellect: number;
		luck: number;
		endurance: number;
		swiftness: number;
	};
	code: string;
	nickname?: string;
	wins?: number;
	battles?: number;
}
