import {
	ApplicationCommandData,
	ButtonInteraction,
	CommandInteraction,
	SelectMenuInteraction,
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

export interface ISelect {
	run: (interaction: SelectMenuInteraction) => any;
}

// export interface IGuild {
// 	name: string;
// 	icon?: string;
// 	registered?: boolean;
// 	nonAdminCanEditPerms?: boolean;
// }

// export interface ITeam {
// 	first: ICharacter;
// 	second: ICharacter;
// }

export enum IPermissionLevels {
	DEVELOPER,
	ADMIN,
	MODERATOR,
}

// export interface IUser {
// 	// Game related
// 	premium?: boolean;
// 	perm?: IPermissionLevels[];
// 	currency?: number;
// 	primary?: ICharacter;
// 	secondary?: ICharacter;
// 	summonCrystals?: number;
// 	characters?: ICharacter[];
// 	kitchen?: string;
// 	// Shared
// 	battles?: number;
// 	wins?: number;
// 	// Web stuff
// 	username?: string;
// 	avatar?: string;
// 	discrim?: string;
// 	guilds?: { [id: string]: IUserGuild };
// }

// export interface IUserGuild {
// 	icon: string | null;
// 	name: string;
// 	perms: number;
// }

// export interface IPreMintCharacter {
// 	id: number;
// 	name: string;
// 	class: 'TANK' | 'ADC' | 'MAGE';
// 	stats: {
// 		id: number;
// 		name: string;
// 		strength: number;
// 		magic: number;
// 		intellect: number;
// 		endurance: number;
// 		swiftness: number;
// 	};
// 	categories?: { id: number; name: string }[];
// 	icon: string;
// 	bio: string;
// }

// export interface ICharacter extends IPreMintCharacter {
// 	hp: number;
// 	startHp: number;
// 	stats: {
// 		id: number;
// 		name: string;
// 		strength: number;
// 		magic: number;
// 		intellect: number;
// 		luck: number;
// 		endurance: number;
// 		swiftness: number;
// 	};
// 	code: string;
// 	nickname?: string;
// 	wins?: number;
// 	battles?: number;
// }
