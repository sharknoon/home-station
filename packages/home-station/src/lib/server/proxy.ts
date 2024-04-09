import fs from 'node:fs/promises';
import path from 'node:path';
import util from 'node:util';
import { exec as e } from 'node:child_process';
import { PUBLIC_CONTAINERIZED } from '$env/static/public';
import { dev } from '$app/environment';
import yaml from 'js-yaml';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { settings } from '$lib/server/schema';
import { logger } from '$lib/server/logger';
import { getDataPath } from '$lib/server/data';

const exec = util.promisify(e);

const container = PUBLIC_CONTAINERIZED === 'true';
const API_URL = 'http://localhost:8080/api';

export async function init() {
    logger.info('Starting proxy');
    await startProxy();
    logger.info('Proxy started');
}

/**
 * Retrieves the version of the web server.
 * @returns A promise that resolves to a object representing the version, the codename and the start date.
 */
export async function getVersion(): Promise<{
    Version: string;
    Codename: string;
    startDate: string;
}> {
    const response = await fetch(API_URL + '/version');
    return await response.json();
}

export async function startProxy(): Promise<void> {
    await writeConfigurationFile();
    const { stdout, stderr } = await exec('supervisorctl -c /etc/supervisord.conf start proxy');
    process.stdout.write(stdout);
    process.stderr.write(stderr);
}

export async function restartProxy(): Promise<void> {
    await writeConfigurationFile();
    const { stdout, stderr } = await exec('supervisorctl -c /etc/supervisord.conf restart proxy');
    process.stdout.write(stdout);
    process.stderr.write(stderr);
}

async function writeConfigurationFile() {
    const certificateEmail =
        (
            await db.query.settings.findFirst({
                where: eq(settings.key, 'certificateEmail')
            })
        )?.value ?? '';
    const httpsEnabled =
        // HTTPS and dev are mutually exclusive
        !dev &&
        (
            await db.query.settings.findFirst({
                where: eq(settings.key, 'httpsEnabled')
            })
        )?.value === 'true';

    const config = {
        global: {
            checkNewVersion: false,
            sendAnonymousUsage: false
        },
        entryPoints: {
            web: {
                address: ':80',
                ...(httpsEnabled
                    ? {
                          http: {
                              redirections: {
                                  entryPoint: {
                                      to: 'websecure',
                                      scheme: 'https',
                                      // Disable permanent redirection because https can be turned off and then the browser cache is wrong
                                      permanent: false
                                  }
                              }
                          }
                      }
                    : {})
            },
            ...(httpsEnabled
                ? {
                      websecure: {
                          address: ':443',
                          http: {
                              tls: {
                                  certResolver: 'leresolver'
                              }
                          }
                      }
                  }
                : {}),
            traefik: {
                address: ':8080'
            }
        },
        providers: {
            http: {
                endpoint: `http://localhost:${dev ? '5173' : '3000'}/api/traefik`
            }
        },
        api: {},
        log: {
            level: dev ? "DEBUG" : "INFO"
        },
        ...(httpsEnabled
            ? {
                  certificatesResolvers: {
                      leresolver: {
                          acme: {
                              email: certificateEmail,
                              tlsChallenge: true
                          }
                      }
                  }
              }
            : {})
    };

    await fs.mkdir(path.join(await getDataPath(), 'proxy'), { recursive: true });
    await fs.writeFile(path.join(await getDataPath(), 'proxy', 'traefik.yml'), yaml.dump(config));
}
