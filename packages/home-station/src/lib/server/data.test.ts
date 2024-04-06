import { describe, it, expect } from 'vitest';
import { getDataPath, getDataPersistency } from './data';
import path from 'node:path';
import os from 'node:os';

describe('getDataPersistency', () => {
    // we can't unit-test the behaviour of the app when running in a container
    it('should return correct persistency information when not running in a container', async () => {
        // Arrange
        const dataPath = path.join(os.tmpdir(), '.home-station');

        // Act
        const result = await getDataPersistency();

        // Assert
        expect(result.isPersistent).toBe(true);
        expect(result.defaultDataPath).toBe(dataPath);
        expect(result.currentDataPath).toBe(dataPath);
    });
});

describe('getDataPath', () => {
    it('should return the correct data path', async () => {
        // Arrange
        const dataPath = path.join(os.tmpdir(), '.home-station');

        // Act
        const result = await getDataPath();

        // Assert
        expect(result).toBe(dataPath);
    });
});
