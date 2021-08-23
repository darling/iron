import { ICharacter } from '../types/db';

// Calculate winning character when put up against each other
export const calcWinner = (
	playerChar: ICharacter,
	enemyChar: ICharacter
): { modPlayerChar: ICharacter; playerWinner: boolean } => {
	return { modPlayerChar: playerChar, playerWinner: true };
};
