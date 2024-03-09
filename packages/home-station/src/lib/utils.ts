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
 * Strips ansi escape sequences from a string
 * @param str The string to be stripped
 * @returns The string without ansi codes
 */
export function stripAnsi(str: string): string {
    // eslint-disable-next-line no-control-regex -- This regex is used to remove ansi escape codes that do come directly from the terminal
    return str.replace(/(?:\x1B|\\u001b)[[(?);]{0,2}(?:;?\d)*./gi, '');
}
