import fs from 'node:fs/promises';
import path from 'node:path';
import { dev } from '$app/environment';
import yaml from 'js-yaml';
import shell from 'shelljs';
import { eq } from 'drizzle-orm';
import { logger } from '$lib/server/logger';
import { getDataPath } from '$lib/server/data';
import { db } from '$lib/server/db';
import { settings } from '$lib/server/schema';

const API_URL = 'http://localhost:8080/api';
const STATIC_CONFIGURATION_FILE = path.join(await getDataPath(), 'traefik.yml');

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

async function generateStaticConfiguration(
    https: { email: string } | false,
    dev: boolean
): Promise<object> {
    // Dev and https are mutally exclusive
    if (dev) https = false;
    return {
        global: {
            checkNewVersion: false,
            sendAnonymousUsage: false
        },

        entryPoints: {
            web: {
                address: ':80',
                ...(https
                    ? {
                          http: {
                              redirections: {
                                  entryPoint: {
                                      to: 'websecure',
                                      scheme: 'https'
                                  }
                              }
                          }
                      }
                    : {})
            },
            ...(https
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
                endpoint: `http://${dev ? 'host.docker.internal:5173' : '127.0.0.1:3000'}/api/traefik`
            }
        },

        api: {},

        ...(https
            ? {
                  certificatesResolvers: {
                      leresolver: {
                          acme: {
                              email: https.email,
                              storage: path.join(await getDataPath(), 'acme.json'),
                              tlsChallenge: {}
                          }
                      }
                  }
              }
            : {}),

        ...(dev
            ? {
                  log: {
                      level: 'DEBUG'
                  }
              }
            : {})
    };
}

/**
 * Applies the static configuration by changing the configuration file
 * and restarting the webserver
 */
export async function applyStaticConfiguration() {
    // Create new static configuration object
    const httpsEnabled =
        (
            await db.query.settings.findFirst({
                where: eq(settings.key, 'httpsEnabled')
            })
        )?.value === 'true';
    const certificateEmail =
        (
            await db.query.settings.findFirst({
                where: eq(settings.key, 'certificateEmail')
            })
        )?.value ?? '';
    const https = httpsEnabled && certificateEmail ? { email: certificateEmail } : false;
    const configuration = generateStaticConfiguration(https, dev);

    // Write object to disk
    await fs.writeFile(STATIC_CONFIGURATION_FILE, yaml.dump(configuration));

    // Restart traefik
    const processFile = shell.which('traefik');
    if (!processFile) {
        logger.warn("Couldn't find traefik executable! Please restart traefik manually");
    }
    // TODO restart traefik
    // Maybe change docker start configuration fro simple bash script to systemd to be able to use systemctl restart
}
