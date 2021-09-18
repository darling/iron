import { User } from '.prisma/client';
import { ButtonInteraction } from 'discord.js';
import { omit, pick, random, toInteger } from 'lodash';
import { prisma } from '../pg';
import { onboardUserEmbed, primaryDeadEmbed } from '../util/prefabEmbeds';

import { characterDamageAdd, newEnemy } from './chars';

/**
 * Start and evoke everything that a battle needs.
 * This will mutate and modify the users information accordingly.
 *
 * @param uid User that wants to battle
 * @return The results of the battle in custom obj | undefined if error
 */
export const battle = async (uid: string, interaction: ButtonInteraction) => {
	let user = await prisma.user.findFirst({
		where: { id: uid },
		include: {
			character: true,
		},
	});

	if (!user) {
		return interaction.update(await onboardUserEmbed(uid));
	}

	let char = user.character;

	if (!char) {
		// Onboard the user here
		return interaction.update({
			content:
				'You do not have a primary fighter, do you want to generate one?',
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
			embeds: [],
		});
	}

	// Find reasons not to battle
	if (char.hp == 0) {
		return interaction.update(await primaryDeadEmbed(user.id));
	}

	// Generate the environment
	let enemy = newEnemy();

	// See who wins (RNG BASICALLY LOL)

	let rng = 2;

	if (char.hp > enemy.hp) {
		rng++;
		rng++;
	}

	rng += char.stars;

	// Determine winner

	const winner = random(0, rng) > 0;

	if (winner) {
		user.wins++;
		char.wins++;

		enemy.hp = 0;
		char = await characterDamageAdd(
			char,
			random(1, toInteger(char.hp / 3))
		);
	} else {
		enemy.hp = toInteger(random(enemy.hp / 2, enemy.hp));
		char.hp = 0;
		// char = await characterDamageAdd(
		// 	char,
		// 	random(toInteger(char.start_hp / 3), toInteger(char.start_hp / 2))
		// );
	}

	user.battles++;
	char.battles++;

	let earnedCurrency = 0;

	if (winner) {
		earnedCurrency = random(10, 30);
	}

	user.currency += earnedCurrency;

	await prisma.user.update({
		data: {
			...pick(user, ['currency', 'battles', 'wins']),
			character: {
				update: {
					...omit(char, [
						'owner',
						'ownerId',
						'id',
						'primaryId',
						'createdDate',
					]),
				},
			},
		},
		where: {
			id: user.id,
		},
	});

	return { enemy, winner, user, earnedCurrency };
};
