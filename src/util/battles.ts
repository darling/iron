import { ceil, clamp, max, random, round } from 'lodash';

import { ICharacter, ITeam } from '../types/db';

const minZero = (number: number): number => {
	return max([number, 0]) || 0;
};

export const calcSingleDamage = (char: ICharacter): number => {
	const rand = random(0, 100);
	const procLuck = rand < char.stats.luc;

	return char.stats.str * (procLuck ? 2 : 1);
};

export const calcTeamDamage = (team: ITeam): number => {
	const rand = random(0, 50);
	let dmg = calcSingleDamage(team.first);

	const intLuck = rand < team.second.stats.int;

	return ceil(dmg * (intLuck ? 1.5 : 1));
};

const MAX_MOVES = 100;

// Calculate winning character when put up against each other
export const calcWinner = (
	playerTeam: ITeam,
	enemyChar: ICharacter
): { modTeam: ITeam; playerWinner: boolean } => {
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
				clamp(dmg, 10, Number.MAX_SAFE_INTEGER) - enemyChar.stats.mag
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

			let turnEffectDmg = minZero(dmg - team.second.stats.mag);

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

	let losthp = minZero(round((ihp - hp) / 2));

	if (playerWin) {
		if (team.second.class === 'MAGE' || team.first.class === 'MAGE') {
			losthp /= 2;
		}

		losthp = Math.abs(losthp);

		team.first.hp = minZero(team.first.hp - losthp + team.first.stats.mag);
		team.second.hp = minZero(
			team.second.hp - losthp + team.second.stats.mag
		);

		if (team.first.hp <= 0 || team.second.hp <= 0) {
			playerWin = false;
		}
	}

	return { modTeam: team, playerWinner: playerWin };
};
