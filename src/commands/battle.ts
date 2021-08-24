import { firestore } from 'firebase-admin';
import { random } from 'lodash';
import { getUser, updateUser } from '../database/user';
import { commands } from '../discord';
import { ITeam } from '../types/db';
import { calcWinner } from '../util/battles';
import { issueCharacter } from '../util/characters';

commands.set('battle', {
	run: async (interaction) => {
		const user = await getUser(interaction.user.id);
		const userTeam = { first: user?.primary, second: user?.secondary };

		// Find reasons not to battle

		if (!userTeam.first || !userTeam.second) {
			interaction.reply({
				content:
					"Can't battle without a primary and secondary character!",
				ephemeral: true,
			});
			return;
		}

		if (userTeam.first.hp <= 0 || userTeam.second.hp <= 0) {
			interaction.reply({
				content: 'ur char dead u cant battle',
				ephemeral: true,
			});
			return;
		}

		// Set the stage

		let team = userTeam as ITeam;

		const enemy = issueCharacter();
		const results = calcWinner(team, enemy);

		// Generate prizes

		const currency = random(10, 100);

		// Save results

		await updateUser(interaction.user.id, {
			currency: firestore.FieldValue.increment(currency) as any,
			primary: results.modTeam.first, // New character states
			secondary: results.modTeam.second,
		});

		// Generate response

		interaction.reply(
			`You ${
				results.playerWinner ? 'win' : 'died'
			}! You gained ~ ${currency} INSERTNONGENERICUNITOFCURRENCYHERE.`
		);
	},
	command: {
		name: 'battle',
		description: 'Battle a random food',
	},
});
