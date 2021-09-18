import { selections } from '../discord';
import { getItem } from '../util/items';
import { itemShopInspection } from '../util/prefabEmbeds';

selections.set('ITEM', {
	run: async (interaction) => {
		const value = interaction.values[0];

		const item = getItem(value);

		if (!item) {
			return interaction.reply({ content: `This item is unknown?` });
		}

		interaction.reply(itemShopInspection(item));
	},
});
