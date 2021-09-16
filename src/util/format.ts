import { floor, join, map, repeat, round, sample } from 'lodash';

const FILLED_START = '<:bar_start:887353631391756310>';
const EMPTY_START = '<:progress_start:887353631412731954>';

const FILLED_END = '<:bar_end:887353631278518323> ';
const EMPTY_END = '<:progress_end:887353631299481640>';

const FILLED_MID = ['<:bar:887353631312085042>'];
const EMPTY_MID = '<:progress:887353631349833738>';

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
