import { Prisma, User } from '@prisma/client';
import { get, has, set, toInteger, toNumber } from 'lodash';
import { prisma } from '../pg';

interface Props {
	amount: number;
	write: boolean;
}

/**
 * easy mutation of inventory
 * @param options.write Write to db
 * @returns
 */
export const giveItem = async (
	user: User,
	item: string,
	options: Props = { amount: 1, write: false }
) => {
	let inventory = user.inventory as Prisma.JsonObject;

	inventory[item] = toInteger(
		toNumber(inventory[item] || 0) + options.amount
	);

	if (options.write) {
		await prisma.user.updateMany({
			data: {
				inventory,
			},
		});
	}

	user.inventory = user.inventory as Prisma.JsonValue;

	return user;
};

export const hasItem = (
	user: User,
	item: string,
	options: Props = { amount: 1, write: false }
) => {
	const inventory = user.inventory as Prisma.JsonObject;
	return has(inventory, item) && toNumber(inventory[item]) >= options.amount;
};

/**
 * Mutate the user to take items from the inventory
 */
export const takeItem = async (
	user: User,
	item: string,
	options: Props = { amount: 1, write: false }
) => {
	let inventory = user.inventory as Prisma.JsonObject;
	let status;

	if (hasItem(user, item, options)) {
		status = true;
		inventory = set(
			inventory,
			item,
			toNumber(get(inventory, item)) - options.amount
		);
	} else {
		status = false;
	}

	if (options.write) {
		await prisma.user.updateMany({
			data: {
				inventory,
			},
		});
	}

	user.inventory = inventory as Prisma.JsonValue;

	return { user, status };
};
