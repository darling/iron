import { toNumber, union } from 'lodash';
import { newPrimary } from '../database/chars';
import { buttons } from '../discord';
import { generatedFood, shopEmbed } from '../util/prefabEmbeds';

buttons.set('SHOP', {
	run: async (interaction) => {
		const [_, uid, page] = interaction.customId.split(/ +/g);

		if (interaction.user.id != uid) {
			const { embeds, components } = shopEmbed(
				interaction.user.id,
				toNumber(page)
			);

			return interaction.reply({
				embeds: union(
					[
						{
							color: 'RED',
							description:
								"Hey! That shop menu was not meant for you. But here's a secret shop just for you!",
						},
					],
					embeds
				),
				components,
				ephemeral: true,
			});
		}

		const newReply = shopEmbed(interaction.user.id, toNumber(page));
		return interaction.update(newReply);
	},
});
