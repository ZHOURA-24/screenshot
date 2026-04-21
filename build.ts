import * as esbuild from 'esbuild';
import { existsSync, mkdirSync } from 'fs';

if (!existsSync('./dist')) {
    mkdirSync('./dist', { recursive: true });
}

await esbuild.build({
    entryPoints: ['server.ts'],
    bundle: true,
    platform: 'node',
    target: 'node22',
    outfile: 'dist/server.js',
    format: 'cjs',
    sourcemap: false,
    minify: false,
});

console.log('Server bundle built successfully!');
