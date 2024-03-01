import { describe, it } from 'vitest';
import { exec } from './terminal';

describe('testTerminal', () => {
    it('should successfully connect to Docker', async () => {
        await exec("docker", "-v")
    })
});