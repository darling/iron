import { pick, sample, assign, random } from 'lodash';
import {
	Column,
	CreateDateColumn,
	Entity,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import charList from '../../static/mintedchardata.json';
import { User } from './User';

@Entity()
export class Character {
	constructor() {
		const randChar = sample(charList);

		if (!randChar) {
			throw 'NO RANDOM CHAR SELECTED, IS THIS AN ERROR?';
		}

		const pickedValues = pick(randChar, ['name', 'bio', 'icon']);

		assign(this, pickedValues);

		this.bio = this.bio.replace(/\"/g, '');

		this.start_hp = random(50, 100);
		this.hp = this.start_hp;

		this.battles = 0;
		this.wins = 0;
	}

	// Default Shared

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true, default: null })
	nickname: string;

	@OneToOne(() => User, (user) => user.primary)
	user: User;

	// PreMint

	@Column()
	name: string;

	/**
	 * CDN icon (unique)
	 */
	@Column()
	icon: string;

	@Column()
	bio: string;

	// Stats

	@Column()
	hp: number;
	@Column()
	start_hp: number;

	@Column({ default: 0 })
	battles: number;
	@Column({ default: 0 })
	wins: number;

	// Meta

	@CreateDateColumn()
	createdDate: Date;
	@UpdateDateColumn()
	updatedDate: Date;
}
