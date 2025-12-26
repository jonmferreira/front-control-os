#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import './node-crypto-hash-polyfill.mjs';

const viteCliUrl = new URL('../node_modules/vite/bin/vite.js', import.meta.url);
const viteCliPath = fileURLToPath(viteCliUrl);

process.argv.splice(1, 1, viteCliPath);

await import(viteCliUrl.href);
