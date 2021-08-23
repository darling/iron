import { CommandInteractionOption } from 'discord.js';

export const compressData = (interactionData: CommandInteractionOption[]) => {
	let res: { [key: string]: CommandInteractionOption } = {};

	interactionData.forEach((option) => {
		res[option.name] = option;
	});

	return res;
};

export const longformStatLabels: { [key: string]: string } = {
	str: 'Strength',
	mag: 'Magic',
	int: 'Intellect',
	luc: 'Luck',
	end: 'Endurance',
	swi: 'Swiftness',
};
