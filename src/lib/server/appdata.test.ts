import { describe, it, expect } from 'vitest';
import { getAppDataPath, getAppDataPersistency } from './appdata';
import path from 'node:path';
import os from 'node:os';

describe('getAppDataPersistency', () => {
    // we can't unit-test the behaviour of the app when running in a container
    it('should return correct persistency information when not running in a container', async () => {
        // Arrange
        const appDataPath = path.join(os.tmpdir(), '.home-station');

        // Act
        const result = await getAppDataPersistency();

        // Assert
        expect(result.isPersistent).toBe(true);
        expect(result.defaultAppDataPath).toBe(appDataPath);
        expect(result.currentAppDataPath).toBe(appDataPath);
    });
});

describe('getAppDataPath', () => {
    it('should return the correct app data path', async () => {
        // Arrange
        const appDataPath = path.join(os.tmpdir(), '.home-station');

        // Act
        const result = await getAppDataPath();

        // Assert
        expect(result).toBe(appDataPath);
    });
});
