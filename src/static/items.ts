import { getItem } from '../util/items';
import itemList from '../static/items.json';
import { Character, Prisma, User } from '.prisma/client';
import { prisma } from '../pg';
import { min, toInteger } from 'lodash';

//@ts-ignore
export const itemPrefabs = new Map<
	ReturnType<typeof getItem>['type'],
	{
		descriptor: (item: typeof itemList[0]) => {};
		use: (
			user: User & {
				character: Character;
			},
			item: typeof itemList[0]
		) => Promise<string>;
	}
>();

itemPrefabs.set('HEALING', {
	descriptor: (item) => `Adds ${item.price} health to a character.`,
	use: async (user, item) => {
		const { character } = await prisma.user.update({
			where: { id: user.id },
			data: {
				inventory: user.inventory as Prisma.JsonObject,
				character: {
					update: {
						hp: {
							set: toInteger(
								min([
									item.price + user.character.hp,
									user.character.start_hp,
								])
							),
						},
					},
				},
			},
			include: {
				character: true,
			},
		});

		if (!character) {
			return 'No character returned on upsert';
		}

		return ` on ${character.emoji} **${character.name}**\n\n${character.name} now has ${character.hp} health.`;
	},
});

itemPrefabs.set('COSMETIC', {
	descriptor: (item) => `Give your character a '${item.value}' title.`,
	use: async (user, item) => {
		if (user.character.nickname != null) {
			return ` on ${user.character.emoji} **${user.character.name}**...\n\nWait?\n\nThe ${item.name} didn't work because ${user.character.name} has a title!`;
		}

		const { character } = await prisma.user.update({
			where: { id: user.id },
			data: {
				inventory: user.inventory as Prisma.JsonObject,
				character: {
					update: {
						name: item.value + ' ' + user.character.name,
						nickname: item.value,
					},
				},
			},
			include: {
				character: true,
			},
		});

		if (!character) {
			return 'No character returned on upsert';
		}

		return ` on ${character.emoji} **${user.character.name}**\n\n${user.character.name} is now called "${character.name}"`;
	},
});
