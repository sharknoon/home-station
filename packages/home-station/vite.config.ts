import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [sveltekit()],
    test: {
        include: ['src/**/*.{test,spec}.{js,ts}']
    },
    define: {
        // Also update src/env.d.ts when changing these
        __REPOSITORY_URL__: JSON.stringify('https://github.com/home-station-org/home-station'),
        __NPM_PACKAGE_VERSION__: JSON.stringify(process.env.npm_package_version),
        __COMMIT_HASH__: JSON.stringify(process.env.COMMIT_HASH ?? 'unknown'),
        __BUILD_DATE__: JSON.stringify(new Date().toISOString())
    }
});
