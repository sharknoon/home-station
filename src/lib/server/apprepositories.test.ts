import { describe, it, expect } from 'vitest';
import { createAppRepository, deleteAppRepository, getAppPath, getAppRepositoryPath } from './apprepositories';
import { getAppDataPath } from './appdata';
import path from 'node:path';
import db from './db';
import { eq } from 'drizzle-orm';
import { appRepositories } from './schema';

describe('getAppRepositoryPath', () => {
    it('should return the correct path', async () => {
        const appRepository = { id: 'github_com_my_org_my_repo', url: '' };
        const appdataPath = await getAppDataPath();
        const expectedPath = path.join(appdataPath, 'appRepositories', appRepository.id);

        const result = getAppRepositoryPath(appRepository);

        expect(result).toBe(expectedPath);
    });
});

describe('getAppPath', () => {
    it('should return the correct path', async () => {
        const app = { appRepositoryId: 'github_com_my_org_my_repo', id: 'my-app' };
        const appdataPath = await getAppDataPath();
        const appReposPath = path.join(appdataPath, 'appRepositories');
        const expectedPath = path.join(appReposPath, app.appRepositoryId, 'apps', app.id);

        // @ts-expect-error We don't need to provide all properties
        const result = getAppPath(app);

        expect(result).toBe(expectedPath);
    });
});

describe('createAppRepository', () => {
    it('should create a new app repository without authentication', async () => {
        // Test input
        const url = 'https://github.com/vitest-dev/vitest.git';

        // Call the function to be tested
        await createAppRepository(url);

        // Assert the expected behavior or outcome
        const newAppRepositoriy = await db.query.appRepositories.findFirst({
            where: eq(appRepositories.url, url)
        });
        expect(newAppRepositoriy).not.toBe(null);
        expect(newAppRepositoriy?.id).toBe('github_com_vitest_dev_vitest');
        expect(newAppRepositoriy!.url).toBe(url);
        expect(newAppRepositoriy!.username).toBe(null);
        expect(newAppRepositoriy!.password).toBe(null);
    });

    it('should create a new app repository with authentication', async () => {
        // Test input
        const url = 'https://github.com/Sharknoon/home-station.git';
        // TODO remove once public
        const username = 'Sharknoon';
        const password = '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';

        // Call the function to be tested
        await createAppRepository(url, username, password);

        // Assert the expected behavior or outcome
        const newAppRepositoriy = await db.query.appRepositories.findFirst({
            where: eq(appRepositories.url, url)
        });
        expect(newAppRepositoriy).not.toBe(null);
        expect(newAppRepositoriy?.id).toBe('github_com_sharknoon_home_station');
        expect(newAppRepositoriy!.url).toBe(url);
        expect(newAppRepositoriy!.username).toBe(username);
        expect(newAppRepositoriy!.password).toBe(password);
    });

    it('should throw an error for invalid URL', async () => {
        // Test input
        const url = 'invalid-url';

        // Call the function to be tested
        try {
            await createAppRepository(url);
            // If the function does not throw an error, fail the test
            expect.fail('Expected an error to be thrown');
        } catch (error) {
            expect((error as Error).message).toBe(
                'Invalid URL (example: "https://github.com/<user>/<repo>")'
            );
        }
    });

    it('should throw an error for invalid credentials', async () => {
        // Test input
        const url = 'https://github.com/my-org/my-repo';
        const username = 'invalid-username';
        const password = 'invalid-password';

        // Call the function to be tested
        try {
            await createAppRepository(url, username, password);
            // If the function does not throw an error, fail the test
            expect.fail('Expected an error to be thrown');
        } catch (error) {
            expect((error as Error).message).toBe('Invalid credentials');
        }
    });
});

describe('deleteAppRepository', () => {
    it('should delete the app repository and its associated files', async () => {
        // Test preparation
        const url = 'https://github.com/octocat/Hello-World.git';
        await createAppRepository(url);
        expect(await db.query.appRepositories.findFirst({ where: eq(appRepositories.url, url) })).toBeTruthy();

        // Call the function to be tested
        await deleteAppRepository('github_com_octocat_hello_world');

        // Assert the expected behavior or outcome
        const deletedAppRepository = await db.query.appRepositories.findFirst({
            where: eq(appRepositories.id, 'github_com_octocat_hello_world')
        });
        expect(deletedAppRepository).toBeFalsy();
    });
});
