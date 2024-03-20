import { testConnection } from './containerengines';
import { describe, it, expect } from 'vitest';

describe('testConnection', () => {
    it('should successfully connect to Docker', async () => {
        // Call the function to be tested
        const result = await testConnection();

        // Assert the expected behavior or outcome
        expect(result.success).toBe(true);
        expect(result.errors).toBeUndefined();
    });
});
