import { createCanvas, loadImage } from 'canvas';
import { chunk, keys, map, padStart, upperCase } from 'lodash';

import { ICharacter } from '../types/db';
import { COLORS } from './colors';
import { longformStatLabels } from './interactionData';

export const genCharProfile = async (char: ICharacter) => {
	const w = 600;
	const h = 400;

	const padding = 25;

	const vertItemSpacing = 20;

	const canvas = createCanvas(w, h);
	const context = canvas.getContext('2d');

	context.antialias = 'subpixel';

	// Bg

	context.fillStyle = `#${COLORS.GRAY}`;
	context.fillRect(0, 0, w, h);

	// Title

	const titleSize = 50;

	context.font = `${titleSize}px Josefin Sans Medium`;
	context.textAlign = 'left';
	context.fillStyle = `#${COLORS.WHITE}`;
	context.fillText(char.name, padding, titleSize + padding);

	// Subtitle

	const classSize = 17;

	context.font = `${classSize}px Roboto Medium Italic`;
	context.textAlign = 'left';
	context.fillStyle = `#${COLORS.WHITE}`;
	context.fillText(
		char.class,
		padding,
		titleSize + padding + classSize + vertItemSpacing
	);

	// Description

	const descSize = 20;

	context.font = `${descSize}px Roboto Medium`;
	context.textAlign = 'left';
	context.fillStyle = `#${COLORS.WHITE}`;

	const { bio } = char;
	const lines = map(chunk(bio.split(/ +/g), 7), (arr) => arr.join(' '));

	lines.forEach((line, i) => {
		context.fillText(
			line,
			padding,
			titleSize +
				classSize +
				vertItemSpacing +
				padding +
				vertItemSpacing +
				descSize * (i + 1) +
				(descSize / 2) * i
		);
	});

	// Thumbnail

	const image = await loadImage(
		`https://cdn.ferris.gg/img/food/${char.icon}.png`
	);

	const imageDimensions = 170;

	context.drawImage(
		image,
		w - imageDimensions - padding,
		padding,
		imageDimensions,
		imageDimensions
	);

	// Statistics

	const stats = keys(char.stats);

	const rowSize = 2;

	const distStats = chunk(stats, rowSize);

	// Build from bottom to up from bottom left with progress bars

	const barHeight = 10;
	const barWidth = 150;

	const vBottom = h - padding;
	const hBottom = padding;

	distStats.forEach((statGroup, row) => {
		statGroup.forEach((stat, i) => {
			const value = (char.stats as any)[stat];

			const lineHeight = 15;

			const hPos = hBottom + (barWidth + padding) * i;
			const vPos = vBottom - padding - row * (barHeight + lineHeight * 2);

			context.fillStyle = `#${COLORS.WHITE}`;
			context.font = `${lineHeight}px Ubuntu Mono Medium`;
			context.textAlign = 'left';
			context.textBaseline = 'middle';
			const longLabel = longformStatLabels[stat];
			context.fillText(
				longLabel,
				hPos,
				vPos - lineHeight + lineHeight * 0.2
			);

			// bg rect
			context.fillStyle = `#${COLORS.YELLOW.REAL}`;
			context.fillRect(hPos, vPos, barWidth, barHeight);

			// Value rect
			context.fillStyle = `#${COLORS.WHITE}`;
			context.fillRect(hPos, vPos, barWidth * (value / 10), barHeight);
		});
	});

	// const statBoxSize = 50;

	// stats.forEach((stat, i) => {
	// 	const value = (char.stats as any)[stat];

	// 	const boxHorPos = padding + statBoxSize * i + 10 * i;
	// 	const boxVerPos = h - statBoxSize - padding;
	// 	const statVerPos = h - padding - statBoxSize / 2;
	// 	const textVerPos = h - padding - statBoxSize;

	// 	context.fillStyle = `#${COLORS.INDIGO.PURE}`;
	// 	context.fillRect(boxHorPos, boxVerPos, statBoxSize, statBoxSize);

	// 	context.fillStyle = `#${COLORS.WHITE}`;
	// 	context.font = `${statBoxSize / 2}px Ubuntu Mono Medium`;
	// 	context.textAlign = 'center';
	// 	context.textBaseline = 'middle';
	// 	context.fillText(
	// 		padStart(`${value}`, 2, '0'),
	// 		boxHorPos + statBoxSize / 2,
	// 		statVerPos
	// 	);

	// 	context.fillStyle = `#${COLORS.WHITE}`;
	// 	context.font = `${statBoxSize * (1 / 3)}px Ubuntu Mono Medium`;
	// 	context.textAlign = 'center';
	// 	context.textBaseline = 'bottom';
	// 	context.fillText(
	// 		padStart(`${upperCase(stat)}`, 2, '0'),
	// 		boxHorPos + statBoxSize / 2,
	// 		textVerPos - 5
	// 	);
	// });

	// Health

	// const healthStartHorPosition =
	// 	padding + statBoxSize * stats.length + 10 * stats.length;

	// context.fillStyle = `#${COLORS.GREEN.PURE}`;
	// context.fillRect(
	// 	healthStartHorPosition,
	// 	h - statBoxSize - padding,
	// 	statBoxSize,
	// 	statBoxSize
	// );

	// Character Meta

	const metaHorPos =
		padding + barWidth * 2 + padding * (rowSize - 1) + vertItemSpacing;
	const metaVerPos = padding + imageDimensions + vertItemSpacing;

	context.fillStyle = `#${COLORS.YELLOW.REAL}`;
	context.fillRect(metaHorPos, metaVerPos, 100, 100);

	return canvas.toBuffer('image/png');
};

export const deletedChar = async (char: ICharacter) => {
	const w = 600;
	const h = 200;

	const padding = 25;

	const canvas = createCanvas(w, h);
	const context = canvas.getContext('2d');

	context.antialias = 'subpixel';

	// Bg

	context.fillStyle = `#${COLORS.GRAY}`;
	context.fillRect(0, 0, w, h);

	// Title

	const titleSize = 75;

	context.font = `${titleSize}px Josefin Sans Medium`;
	context.textAlign = 'left';
	context.fillStyle = `#${COLORS.WHITE}`;

	if (context.measureText(char.name).width > 200) {
		context.font = `${titleSize * (2 / 3)}px Josefin Sans Medium`;
	}

	context.fillText(char.name, padding, titleSize + padding);

	context.font = `${titleSize / 3}px Roboto Medium`;
	context.textAlign = 'left';
	context.fillStyle = `#${COLORS.WHITE}`;

	context.fillText(
		'Has been eaten.',
		padding,
		titleSize + padding + 25 + titleSize / 3
	);

	return canvas.toBuffer('image/png');
};