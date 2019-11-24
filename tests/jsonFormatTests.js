import test from 'ava';

import glob from 'glob';
import { readFileSync } from 'fs';
import { basename } from 'path';

import { config } from '../gulpconfig';

config.assets.data.forEach(pattern => {
	const jsons = glob.sync(pattern);
	jsons.forEach(function (file) {
		if (!/\.json$/i.exec(file)) {
			return;
		}
		test(`Test JSON: ${basename(file)}`, t => {
			try {
				const data = readFileSync(file, 'utf8');
				const jsonData = JSON.parse(data);
				t.true(jsonData != null);
			} catch (error) {
				t.fail(`Json file ${basename(file)} failed to parse as json...`);
			}
		});
	});
});

