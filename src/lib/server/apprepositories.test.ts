import { describe, it, expect, afterEach } from 'vitest';
import {
    createAppRepository,
    deleteAppRepository,
    getAppPath,
    getAppRepositoryPath,
    updateAvailableApps
} from './apprepositories';
import { getAppDataPath } from './appdata';
import path from 'node:path';
import db from './db';
import { eq } from 'drizzle-orm';
import { appRepositories, availableApps } from './schema';
import fs from 'fs/promises';

afterEach(async () => {
    await db.delete(appRepositories);
    const appReposPath = path.join(await getAppDataPath(), 'appRepositories')
    await fs.rm(appReposPath, { recursive: true, force: true });
});

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
        const url = 'https://github.com/home-station-org/private-repository-access-test.git';
        const username = 'Sharknoon';
        // This token is heavily restricted and only used for testing purposes
        // It has only access to the empty repository "home-station-org/private-repository-access-test"
        // The following access rights were granted: repository contents read-only, metadata read-only
        const password =
            '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';

        // Call the function to be tested
        await createAppRepository(url, username, password);

        // Assert the expected behavior or outcome
        const newAppRepositoriy = await db.query.appRepositories.findFirst({
            where: eq(appRepositories.url, url)
        });
        expect(newAppRepositoriy).not.toBe(null);
        expect(newAppRepositoriy?.id).toBe(
            'github_com_home_station_org_private_repository_access_test'
        );
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
        expect(
            await db.query.appRepositories.findFirst({ where: eq(appRepositories.url, url) })
        ).toBeTruthy();

        // Call the function to be tested
        await deleteAppRepository('github_com_octocat_hello_world');

        // Assert the expected behavior or outcome
        const deletedAppRepository = await db.query.appRepositories.findFirst({
            where: eq(appRepositories.id, 'github_com_octocat_hello_world')
        });
        expect(deletedAppRepository).toBeFalsy();
    });
});

describe('updateAvailableApps', () => {
    it('should update the available apps', async () => {
        // Test preparation
        const url = 'https://github.com/home-station-org/apps.git';
        // TODO remove once public
        const username = 'Sharknoon';
        const password =
            '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';
        await createAppRepository(url, username, password);

        expect(
            await db.query.appRepositories.findFirst({ where: eq(appRepositories.url, url) })
        ).toBeTruthy();

        // Call the function to be tested
        await updateAvailableApps(() => {});

        // Assert the expected behavior or outcome
        const path = getAppRepositoryPath({ id: 'github_com_home_station_org_apps', url });
        expect(await fs.stat(path)).toBeTruthy();
        expect(await fs.stat(path + '/apps')).toBeTruthy();
        expect((await fs.readdir(path + '/apps')).length).toBeGreaterThan(0);
        const apps = await db.query.availableApps.findMany({
            where: eq(availableApps.appRepositoryId, 'github_com_home_station_org_apps')
        });
        expect(apps.length).toBeGreaterThan(0);
    });
});
