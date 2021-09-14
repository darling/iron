import { floor, join, map, repeat, round, sample } from 'lodash';

const FILLED_START = '<a:fs:887192032953647154>';
const EMPTY_START = '<:estart:887194115836637224>';

const FILLED_END = '<a:fe:887192419085455381>';
const EMPTY_END = '<:eend:887194115916316712>';

const FILLED_MID = [
	'<a:fm:887192032899104809>',
	'<a:fm2:887193484786802748>',
	'<a:fm3:887193484849709086>',
];
const EMPTY_MID = '<:ebar:887194116092489758>';

export const progressBar = (value: number, whole: number): string => {
	const segments = 10;

	const bars = round((value / whole) * segments);

	let mutable = map(Array(segments), (_, i) => {
		let pos = i + 1;
		const filled = pos <= bars;

		switch (pos) {
			case 1: // First element
				return filled ? FILLED_START : EMPTY_START;
			case segments: // Last
				return filled ? FILLED_END : EMPTY_END;
			default:
				// Middle
				return filled ? sample(FILLED_MID) : EMPTY_MID;
		}
	});

	return join(mutable, '');
};
