import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(() => ({
    root: import.meta.dirname,
    cacheDir: '../../node_modules/.vite/apps/api',
    plugins: [nxViteTsPaths()],
    test: {
        name: 'api',
        watch: false,
        globals: true,
        environment: 'node',
        passWithNoTests: true,
        include: [
            '{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}',
        ],
        reporters: ['default'],
        coverage: {
            reportsDirectory: '../../coverage/apps/api',
            provider: 'v8' as const,
        },
    },
}));
