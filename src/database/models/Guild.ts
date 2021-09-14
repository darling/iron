import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';

import { User } from './User';

/**
 * Database entry for a guild/kitchen
 */
@Entity()
export class Guild {
	/**
	 * Init with an id
	 * @param uid Discord Snowflake Id for guild
	 */
	constructor(id: string, name: string, icon: string | null, owner: User) {
		this.id = id;

		this.owner = owner;

		this.name = name;
		this.icon = icon || null;
	}

	// Default Shared

	/**
	 * Discord ID
	 */
	@PrimaryColumn()
	id: string;

	/**
	 * Discord Guild Name
	 */
	@Column()
	name: string;

	/**
	 * Discord Guild Icon Hash
	 */
	@Column({ type: 'text', nullable: true })
	icon: string | null;

	// Game

	@Column({ default: 0 })
	currency: number;

	/**
	 * Kitchen determines if access to users and game benefits exist.
	 *
	 * Kitchens provide:
	 *  - item shop advantages
	 *  - xp advantages
	 *  - user advantages
	 */
	@Column({ default: false })
	kitchen: boolean;

	@Column({ default: false })
	public: boolean;

	// Users

	/**
	 * Show registered users that sign up for this specific kitchen.
	 * Obviously this should only be accessable when kitchen is true.
	 */
	@OneToMany(() => User, (user) => user.kitchen, {
		cascade: ['insert', 'update'],
	})
	@JoinColumn()
	users: User[];

	/**
	 * Owner
	 */
	@ManyToOne(() => User, {
		cascade: ['insert'],
	})
	@JoinColumn()
	owner: User;

	// Meta

	@CreateDateColumn()
	createdDate: Date;
	@UpdateDateColumn()
	updatedDate: Date;
}
