import { describe, it, expect } from 'vitest'
import { getAppDataPath, getAppDataPersistency } from './appdata';
import path from 'node:path';

describe('getAppDataPersistency', () => {
  // we can't unit-test the behaviour of the app when running in a container
  it('should return correct persistency information when not running in a container', async () => {
    // Arrange
    let homePath;
    switch (process.platform) {
        case 'win32':
            homePath = process.env.APPDATA;
            break;
        default:
            homePath = process.env.HOME;
    }
    const appDataPath = path.join(homePath ?? "", '.home-station');;

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
    let homePath;
    switch (process.platform) {
        case 'win32':
            homePath = process.env.APPDATA;
            break;
        default:
            homePath = process.env.HOME;
    }
    const appDataPath = path.join(homePath ?? "", '.home-station');

    // Act
    const result = await getAppDataPath();

    // Assert
    expect(result).toBe(appDataPath);
  });
});