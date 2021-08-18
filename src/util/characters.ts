import { random } from 'lodash';
import { ICharacter } from '../types/db';

export const issueCharacter = (override: Partial<ICharacter>): ICharacter => {
	let res: ICharacter = {
		name: '',
		class: 'ADC',
		health: random(50, 100, false),
		level: random(0, 5, false),
	};

	return { ...res, ...override };
};
