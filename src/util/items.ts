import { find, keyBy } from 'lodash';
import { itemPrefabs } from '../static/items';
import itemList from '../static/items.json';

const itemById = keyBy(itemList, 'icon');

export const getItem = (icon: string) => {
	return itemById[icon];
};

export const getItemMeta = (item: ReturnType<typeof getItem>) => {
	return itemPrefabs.get(item.type)?.descriptor(item);
};

/**
 * Get the use function of an item.
 * @param item Item Id to get
 * @returns
 */
export const getItemUse = (item: ReturnType<typeof getItem>) => {
	return itemPrefabs.get(item.type)?.use;
};
