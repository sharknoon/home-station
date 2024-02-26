import { testLocalConnection } from './containerengines';
import Docker from 'dockerode';
import { describe, it, expect } from 'vitest';

describe('testLocalConnection', () => {
    it('should successfully connect to Docker', async () => {
        // Call the function to be tested
        const result = await testLocalConnection();

        // Assert the expected behavior or outcome
        expect(result).toBeInstanceOf(Docker);
    });

    it('should reject with error message when unable to connect to Docker', async () => {
        // Call the function to be tested
        const result = testLocalConnection('/some/nonexistent/path.sock');

        // Assert the expected behavior or outcome
        await expect(result).rejects.toThrow(
            "Couldn't connect to Docker: connect ENOENT /some/nonexistent/path.sock"
        );
    });
});
