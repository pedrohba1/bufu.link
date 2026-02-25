#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { load } from 'cheerio';
import svgpath from 'svgpath';
import svgPathBounds from 'svg-path-bounds';

const args = process.argv.slice(2);

if (!args.length) {
	printHelp();
	process.exit(1);
}

let padding = 0;
let dryRun = false;
let precision = 4;
const targets = [];

for (let i = 0; i < args.length; i += 1) {
	const arg = args[i];
	switch (arg) {
		case '--padding':
		case '-p':
			padding = Number.parseFloat(args[i + 1]);
			if (Number.isNaN(padding)) {
				console.error('Missing numeric value after --padding');
				process.exit(1);
			}
			i += 1;
			break;
		case '--precision':
			precision = Number.parseInt(args[i + 1], 10);
			if (Number.isNaN(precision) || precision < 0) {
				console.error('Missing numeric value after --precision');
				process.exit(1);
			}
			i += 1;
			break;
		case '--dry-run':
			dryRun = true;
			break;
		case '--help':
		case '-h':
			printHelp();
			process.exit(0);
		default:
			targets.push(arg);
	}
}

if (!targets.length) {
	console.error('No SVG files provided');
	process.exit(1);
}

const format = (value) => Number.parseFloat(value.toFixed(precision)).toString();

for (const target of targets) {
	const inputPath = resolve(target);
	const raw = readFileSync(inputPath, 'utf8');
	const $ = load(raw, { xmlMode: true, decodeEntities: false });
	const svgEl = $('svg').first();
	if (!svgEl.length) {
		console.warn(`Skipping ${target}: <svg> root not found`);
		continue;
	}

	let minX = Number.POSITIVE_INFINITY;
	let minY = Number.POSITIVE_INFINITY;
	let maxX = Number.NEGATIVE_INFINITY;
	let maxY = Number.NEGATIVE_INFINITY;
	let processed = 0;

	$('path').each((_, el) => {
		const d = el.attribs?.d;
		if (!d) return;
		let path = svgpath(d).abs();
		const transformChain = collectTransforms(el);
		if (transformChain) {
			path = path.transform(transformChain);
		}
		let bounds;
		try {
			bounds = svgPathBounds(path.toString());
		} catch (error) {
			console.warn(`Unable to compute bounds for a path in ${target}:`, error.message);
			return;
		}
		const [x1, y1, x2, y2] = bounds;
		if ([x1, y1, x2, y2].some((n) => !Number.isFinite(n))) {
			return;
		}
		processed += 1;
		if (x1 < minX) minX = x1;
		if (y1 < minY) minY = y1;
		if (x2 > maxX) maxX = x2;
		if (y2 > maxY) maxY = y2;
	});

	if (!processed) {
		console.warn(`Skipping ${target}: no <path> elements with calculable bounds`);
		continue;
	}

	minX -= padding;
	minY -= padding;
	maxX += padding;
	maxY += padding;

	const width = maxX - minX;
	const height = maxY - minY;

	svgEl.attr('viewBox', `${format(minX)} ${format(minY)} ${format(width)} ${format(height)}`);
	svgEl.attr('width', format(width));
	svgEl.attr('height', format(height));

	const output = $.xml();
	if (!dryRun) {
		writeFileSync(inputPath, output);
	}
	const mode = dryRun ? 'dry-run' : 'updated';
	console.log(`[${mode}] ${target} → viewBox ${svgEl.attr('viewBox')}`);
}

function collectTransforms(node) {
	const chain = [];
	let current = node;
	while (current && current.type !== 'root') {
		const value = current.attribs?.transform?.trim();
		if (value) {
			chain.push(value);
		}
		current = current.parent;
	}
	return chain.length ? chain.reverse().join(' ') : '';
}

function printHelp() {
	console.log(`Usage: node scripts/fit-svg-viewbox.mjs [options] <svg...>

Options:
  -p, --padding <value>   Add padding (in SVG units) around detected bounds (default: 0)
      --precision <int>   Decimal places to keep when writing numbers (default: 4)
      --dry-run           Print the computed viewBox without modifying files
  -h, --help              Show this help message
`);
}
