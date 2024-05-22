import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import {
    createMarketplace,
    deleteMarketplace,
    getMarketplaceAppPath,
    getMarketplacePath,
    updateMarketplaceApps
} from './marketplaces';
import { getDataPath } from './data';
import path from 'node:path';
import { db } from './db';
import { eq } from 'drizzle-orm';
import { marketplaces, marketplaceApps } from './schema';
import fs from 'fs/promises';

beforeAll(async () => {
    await db.delete(marketplaces);
    const marketplacePath = path.join(await getDataPath(), 'marketplaces');
    await fs.rm(marketplacePath, { recursive: true, force: true });
});

afterEach(async () => {
    await db.delete(marketplaces);
    const marketplacePath = path.join(await getDataPath(), 'marketplaces');
    await fs.rm(marketplacePath, { recursive: true, force: true });
});

describe('getMarketplacePath', () => {
    it('should return the correct path', async () => {
        const marketplace = { gitRemoteUrl: 'https://github.com/my-org/my-repo' };
        const dataPath = await getDataPath();
        const marketplaceId = marketplace.gitRemoteUrl
            .replace('https://', '')
            .replace('http://', '')
            .replace(/\.git$/, '')
            .replace(/[^a-z0-9]/gi, '_')
            .toLowerCase();
        const expectedPath = path.join(dataPath, 'marketplaces', marketplaceId);

        const result = getMarketplacePath(marketplace.gitRemoteUrl);

        expect(result).toBe(expectedPath);
    });
});

describe('getMarketplaceAppPath', () => {
    it('should return the correct path', async () => {
        const app = {
            id: 'github.com/my-org/my-repo:my-app',
            marketplaceUrl: 'https://github.com/my-org/my-repo'
        };
        const dataPath = await getDataPath();
        const marketplaceId = app.marketplaceUrl
            .replace('https://', '')
            .replace('http://', '')
            .replace(/\.git$/, '')
            .replace(/[^a-z0-9]/gi, '_')
            .toLowerCase();
        const expectedPath = path.join(
            dataPath,
            'marketplaces',
            marketplaceId,
            'apps',
            app.id.split(':')[1]
        );

        const result = getMarketplaceAppPath(app.marketplaceUrl, app.id);

        expect(result).toBe(expectedPath);
    });
});

describe('createMarketplace', () => {
    it('should create a new marketplace without authentication', { timeout: 60000 }, async () => {
        // Test input
        const url = 'https://github.com/vitest-dev/vitest.git';

        // Call the function to be tested
        await createMarketplace(url);

        // Assert the expected behavior or outcome
        const newMarketplace = await db.query.marketplaces.findFirst({
            where: eq(marketplaces.gitRemoteUrl, url)
        });
        expect(newMarketplace).not.toBe(null);
        expect(newMarketplace!.gitRemoteUrl).toBe(url);
        expect(newMarketplace!.gitUsername).toBe(null);
        expect(newMarketplace!.gitPassword).toBe(null);
    });

    it('should throw an error for invalid URL', async () => {
        // Test input
        const url = 'invalid-url';

        // Call the function to be tested
        try {
            await createMarketplace(url);
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
            await createMarketplace(url, username, password);
            // If the function does not throw an error, fail the test
            expect.fail('Expected an error to be thrown');
        } catch (error) {
            expect((error as Error).message).toBe('Invalid credentials');
        }
    });
});

describe('deleteMarketplace', () => {
    it('should delete the marketplace and its associated files', async () => {
        // Test preparation
        const url = 'https://github.com/octocat/Hello-World.git';
        await createMarketplace(url);
        expect(
            await db.query.marketplaces.findFirst({ where: eq(marketplaces.gitRemoteUrl, url) })
        ).toBeTruthy();

        // Call the function to be tested
        await deleteMarketplace(url);

        // Assert the expected behavior or outcome
        const deletedMarketplace = await db.query.marketplaces.findFirst({
            where: eq(marketplaces.gitRemoteUrl, url)
        });
        expect(deletedMarketplace).toBeFalsy();
    });
});
