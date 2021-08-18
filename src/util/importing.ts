import { readdirSync } from 'fs';
import { join } from 'path';

export const requireDirectory = (path: string) => {
	const events = readdirSync(path, {
		withFileTypes: true,
	});

	events.forEach((item) => {
		if (item.isFile() && item.name.endsWith('.js'))
			require(join(path, item.name));
	});
};
