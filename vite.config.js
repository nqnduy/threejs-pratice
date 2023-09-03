import { defineConfig } from 'vite'
import dns from 'dns';
import alias from '@rollup/plugin-alias'
import { resolve } from 'path'

// vite.config.js
dns.setDefaultResultOrder('verbatim');
const projectRootDir = resolve(__dirname);

export default defineConfig({
    plugins: [
        alias({
            entries: [
            {
                find: '@',
                replacement: resolve(projectRootDir, 'src')
            }
            ]
        })
    ],
    server: {
    host: 'localhost',
    cors: '*',
    port: 3000,
    hmr: {
        host: 'localhost',
        protocol: 'ws',
    },
    },
    build: {
        minify: true,
        manifest: true,
        rollupOptions: {
            input: './src/main.js',
            output: {
                format: 'umd',
                entryFileNames: 'main.js',
                esModule: false,
                compact: true,
                globals: {
                    jquery: '$',
                },
            },
            external: ['jquery'],
        },
    },
})
