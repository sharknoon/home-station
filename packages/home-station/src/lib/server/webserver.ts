import fs from 'node:fs/promises';
import yaml from 'js-yaml';
import shell from "shelljs"
import { logger } from '$lib/server/logger';

const API_URL = 'http://localhost:8080/api';
const STATIC_CONFIGURATION_FILE = '/data/traefik.yml';

/**
 * Retrieves the version of the web server.
 * @returns A promise that resolves to a object representing the version, the codename and the release date.
 */
export async function getVersion(): Promise<{
    Version: string;
    Codename: string;
    startDate: string;
}> {
    const response = await fetch(API_URL + '/version');
    return await response.json();
}

/**
 * Applies the static configuration by changing the configuration file
 * and restarting the webserver
 */
export async function applyStaticConfiguration(
    configuration: (currentConfiguration: object) => object
) {
    const oldConfiguration = yaml.load(
        await fs.readFile(STATIC_CONFIGURATION_FILE, { encoding: 'utf8' })
    ) as object;
    const newConfiguration = configuration(oldConfiguration);
    await fs.writeFile(STATIC_CONFIGURATION_FILE, yaml.dump(newConfiguration));
    const processFile = shell.which("traefik");
    if (!processFile) {
        logger.warn("Couldn't find traefik executable! Please restart traefik manually")
    }
    // TODO restart traefik
    // Maybe change docker start configuration fro simple bash script to systemd to be able to use systemctl restart
}
