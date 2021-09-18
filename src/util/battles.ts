import {
	Interaction,
	InteractionReplyOptions,
	InteractionResponseType,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
} from 'discord.js';
import {
	ceil,
	clamp,
	max,
	random,
	round,
	sampleSize,
	startCase,
	join,
	map,
	omit,
	remove,
} from 'lodash';

import { client } from '../discord';
import { prisma } from '../pg';
import {
	charactersViewEmbed,
	onboardUserEmbed,
	primaryDeadEmbed,
} from './prefabEmbeds';
import { COOKING_VERBS } from './vocab';

const minZero = (number: number): number => {
	return max([number, 0]) || 0;
};

export const calcSingleDamage = (char: any): number => {
	const rand = random(0, 100);
	const procLuck = rand < char.stats.luck;

	return char.stats.strength * (procLuck ? 2 : 1);
};

export const calcTeamDamage = (team: any): number => {
	const rand = random(0, 50);
	let dmg = calcSingleDamage(team.first);
	let secondDmg = calcSingleDamage(team.second);

	const intLuck = rand < team.second.stats.intellect;

	return ceil(dmg * (intLuck ? 1.5 : 1) + secondDmg);
};

const MAX_MOVES = 100;

// Calculate winning character when put up against each other
export const calcWinner = (
	playerTeam: any,
	enemyChar: any
): { modTeam: any; playerWinner: boolean } => {
	let team = playerTeam;
	let hp = team.first.hp + team.second.hp;
	let ihp = hp;

	// Loop combat with the safety ON
	for (let i = 0; i < MAX_MOVES; i++) {
		const isPlayerTurn = i % 2 === 0;

		if (isPlayerTurn) {
			// Player
			const dmg = calcTeamDamage(team);
			const turnEffectDmg = minZero(
				clamp(dmg, 10, Number.MAX_SAFE_INTEGER) - enemyChar.stats.magic
			);

			enemyChar.hp = clamp(
				enemyChar.hp - turnEffectDmg,
				0,
				enemyChar.startHp
			);
		} else {
			const dmg = clamp(
				calcSingleDamage(enemyChar),
				10,
				Number.MAX_SAFE_INTEGER
			);
			// Enemy (presumably single)

			let turnEffectDmg = minZero(dmg - team.second.stats.magic);

			if (team.second.class === 'TANK') {
				turnEffectDmg *= 0.5;
			}

			hp = clamp(
				hp - turnEffectDmg,
				0,
				team.first.startHp + team.second.startHp
			);
		}
		// Winning condition is a dead food
		if (hp <= 0 || enemyChar.hp <= 0) {
			// console.log('turns:', i + 1);
			break;
		}
	}

	let playerWin = hp > 0;

	let losthp = minZero(round(ihp - hp));

	if (playerWin) {
		if (team.second.class === 'MAGE' || team.first.class === 'MAGE') {
			losthp /= 1.3;
		}

		losthp = Math.abs(losthp);

		team.first.hp = minZero(
			team.first.hp -
				Math.ceil(Math.abs(-losthp + team.first.stats.magic))
		);

		team.second.hp = minZero(
			team.second.hp -
				Math.ceil(Math.abs(-losthp + team.second.stats.magic))
		);

		if (team.first.hp <= 0 || team.second.hp <= 0) {
			playerWin = false;
		}
	}

	return { modTeam: team, playerWinner: playerWin };
};

/**
 * Get a MessagePayload that invites a user to battle
 * @returns MessagePayload like object with the correct buttons and messages setup
 */
export const getBattleMessage = async (
	uid: string
): Promise<InteractionReplyOptions> => {
	const user = await prisma.user.findUnique({
		where: { id: uid },
		include: {
			character: true,
			characters: true,
			kitchen: true,
		},
	});

	if (user == null) {
		return await onboardUserEmbed(uid);
	}

	if (!user.character) {
		return {
			components: [
				{
					type: 'ACTION_ROW',
					components: [
						{
							type: 'BUTTON',
							style: 'PRIMARY',
							label: 'Generate',
							customId: 'GENERATE',
						},
					],
				},
			],
			embeds: [
				new MessageEmbed({
					description:
						'You do not have a primary fighter, do you want to generate one?',
					color: 'WHITE',
				}),
			],
		};
	}

	if (user.character.hp <= 0) {
		return await primaryDeadEmbed(uid);
	}

	const embed = new MessageEmbed();

	embed.setTitle('Get ready to battle!');

	user?.character &&
		embed.setThumbnail(
			`https://cdn.ferris.gg/img/food/${user.character.icon}.png`
		);

	let desc = '';

	user?.character &&
		(desc += join(
			map(
				remove(
					user.characters,
					(char) => char.id !== user.character?.id
				),
				'emoji'
			),
			' '
		));

	desc += '\n\nPick an option to fight!';

	embed.setDescription(desc);

	const fightButtons = new MessageActionRow();

	sampleSize(COOKING_VERBS, 3).forEach((item) => {
		const button = new MessageButton({
			customId: `BATTLE ${uid} ${item.toUpperCase()}`,
			style: 'PRIMARY',
			label: startCase(item),
			type: 'BUTTON',
		});

		fightButtons.addComponents(button);
	});

	return { embeds: [embed], components: [fightButtons] };
};

/**
 * Generate a battle invitation to a user's dm
 * @param uid
 * @returns
 */
export const createBattle = async (uid: string) => {
	const user = await client.users.fetch(uid);
	const channel = await user.createDM();

	if (!channel || !channel.isText()) return;

	// Create a character to fight against

	channel.send(await getBattleMessage(uid));
};
