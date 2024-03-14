// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            user: import('lucia').User | null;
            session: import('lucia').Session | null;
        }
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }

    // Also update vite.config.ts when changing these
    const __REPOSITORY_URL__: string;
    const __NPM_PACKAGE_VERSION__: string;
    const __COMMIT_HASH__: string;
    const __BUILD_DATE__: string;
}

export {};
