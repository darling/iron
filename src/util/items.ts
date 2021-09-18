import { find } from 'lodash';
import itemList from '../static/items.json';

export const getItem = (icon: string) => {
	return find(itemList, ['icon', icon]);
};
