import { ButtonInteraction } from 'discord.js';
import { random, toInteger } from 'lodash';
import { getConnection } from 'typeorm';

import { characterDamageAdd, newEnemy } from './chars';
import { getUser } from './user';

/**
 * Start and evoke everything that a battle needs.
 * This will mutate and modify the users information accordingly.
 *
 * @param uid User that wants to battle
 * @return The results of the battle in custom obj | undefined if error
 */
export const battle = async (uid: string, interaction: ButtonInteraction) => {
	const user = await getUser(uid);

	if (!user.primary) {
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
	if (user.primary.hp == 0) {
		return interaction.update({
			content: `**${user.primary.name}** is **dead**, you can not battle right now!`,
			components: [],
			embeds: [],
		});
	}

	// See who wins (RNG BASICALLY LOL)

	const winner = random(0, 2) > 0;

	// Generate the environment

	let enemy = await newEnemy();

	if (winner) {
		user.wins++;
		user.primary.wins++;

		enemy.hp = 0;
		user.primary = await characterDamageAdd(
			user.primary,
			random(1, toInteger(user.primary.hp / 3))
		);
	} else {
		enemy.hp = random(1, enemy.hp);
		user.primary.hp = 0;
	}

	user.battles++;
	user.primary.battles++;

	let earnedCurrency = 0;

	if (winner) {
		earnedCurrency = random(10, 30);
	}

	user.currency += earnedCurrency;

	const connection = getConnection();
	await connection.manager.save(user);

	return { enemy, winner, user, earnedCurrency };
};
