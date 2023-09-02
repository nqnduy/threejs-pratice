import { defineConfig } from 'vite'
import dns from 'dns';

// vite.config.js
dns.setDefaultResultOrder('verbatim');

export default defineConfig({
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
