import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';

import { Character } from './Character';
import { Guild } from './Guild';

/**
 * Database entry for a user
 */
@Entity()
export class User {
	/**
	 * Init with an id
	 * @param uid Discord Snowflake Id for user
	 */
	constructor(uid?: string) {
		uid && (this.id = uid);
	}

	// Default Shared

	@PrimaryColumn()
	id: string;
	@Column({ default: false })
	premium: boolean;

	// Website

	/**
	 * Custom URL
	 */
	@Column({ type: 'text', nullable: true })
	vanity: string | null;

	// Game

	@Column({ default: 0 })
	currency: number;
	@Column({ default: 0 })
	battles: number;
	@Column({ default: 0 })
	wins: number;

	// Characters

	@Column({ type: 'timestamp', nullable: true })
	lastPrimaryChange: Date | null;

	/**
	 * Primary characters are for dmg within combat
	 */
	@OneToOne(() => Character, (character) => character.user, {
		cascade: ['insert', 'update'],
		eager: true,
		nullable: true,
	})
	@JoinColumn()
	primary: Character | null;

	// Guild
	@ManyToOne(() => Guild, (guild) => guild.users)
	kitchen: Guild;

	// @OneToMany(() => Guild, (guild) => guild.owner)
	// ownedGuilds: Guild[];

	// Meta

	@CreateDateColumn()
	createdDate: Date;
	@UpdateDateColumn()
	updatedDate: Date;
}
