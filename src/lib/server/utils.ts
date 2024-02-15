import fs from 'node:fs/promises';

/**
 * Checks if a path exists
 * @param path A path to a folder or a file e.g. /path/to/my/file.png
 * @returns true if the path exists, false otherwise
 */
export async function exists(path: string): Promise<boolean> {
    try {
        await fs.access(path, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

/**
 * Checks if a url is valid
 * @param url A url e.g. https://example.com
 * @returns true if the url is valid, false otherwise
 */
export function isValidUrl(url: string): boolean {
    try {
        return Boolean(new URL(url));
    } catch {
        return false;
    }
}

/**
 * Reduces the number of calls of a callback function by throttling it
 * @param callback The callback function to be throttled
 * @param delay The delay in milliseconds in which calls shall occur
 * @returns The throttled callback function
 * @see https://skilled.dev/course/throttle
 */
export function throttle<T>(
    callback: (...args: T[]) => void,
    delay: number = 1000
): (...args: T[]) => void {
    let throttleTimeout: NodeJS.Timeout | null = null;
    let storedArgs: T[] | null = null;

    const throttledCallback = (...args: T[]) => {
        storedArgs = args;
        const shouldExecuteCallback = !throttleTimeout;
        if (shouldExecuteCallback) {
            callback(...storedArgs);
            storedArgs = null;
            throttleTimeout = setTimeout(() => {
                throttleTimeout = null;
                if (storedArgs) {
                    throttledCallback(...storedArgs);
                }
            }, delay);
        }
    };

    return throttledCallback;
}