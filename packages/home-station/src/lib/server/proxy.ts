import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { settings } from '$lib/server/schema';
import { logger } from '$lib/server/logger';
import { containerEngine } from '$lib/server/containerengines';

const API_URL = 'http://localhost:8080/api';

export async function init() {
    logger.info('Starting proxy');
    await stopProxy();
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
    const certificateEmail =
        (
            await db.query.settings.findFirst({
                where: eq(settings.key, 'certificateEmail')
            })
        )?.value ?? '';
    const httpsEnabled =
        // HTTPS and dev are mutually exclusive
        !dev &&
        certificateEmail.length > 0 &&
        (
            await db.query.settings.findFirst({
                where: eq(settings.key, 'httpsEnabled')
            })
        )?.value === 'true';

    const args = [
        '--global.checknewversion=false',
        '--global.sendanonymoususage=false',
        '--entrypoints.web.address=:80',
        httpsEnabled ? '--entrypoints.web.http.redirections.entrypoint.to=websecure' : '',
        httpsEnabled ? '--entrypoints.web.http.redirections.entrypoint.scheme=https' : '',
        // Disable permanent redirection because https can be turned off and then the browser cache is wrong
        httpsEnabled ? '--entrypoints.web.http.redirections.entrypoint.permanent=false' : '',
        httpsEnabled ? '--entrypoints.websecure.address=:443' : '',
        httpsEnabled ? '--entrypoints.websecure.http.tls.certresolver=leresolver' : '',
        '--entrypoints.traefik.address=:8080',
        `--providers.http.endpoint=http://${dev ? 'host.docker.internal:5173' : 'localhost:3000'}/api/traefik`,
        '--api=true',
        httpsEnabled ? `--certificatesresolvers.leresolver.acme.email=${certificateEmail}` : '',
        httpsEnabled ? '--certificatesresolvers.leresolver.acme.tlschallenge=true' : '',
        dev ? '--log.level=DEBUG' : ''
    ].filter((a) => a.length > 0);

    const httpPort = env.HOME_STATION_HTTP_PORT ?? '80';
    const httpsPort = env.HOME_STATION_HTTPS_PORT ?? '443';

    const proxy = await containerEngine.createContainer({
        name: 'home-station-proxy',
        Labels: { 'home-station.proxy': 'true' },
        HostConfig: {
            NetworkMode: 'home-station',
            PortBindings: {
                '80': [{ HostPort: httpPort }],
                ...(httpsEnabled ? { '443': [{ HostPort: httpsPort }] } : {}),
                ...(dev ? { '8080': [{ HostPort: '8080' }] } : {})
            },
            Binds: ['/var/run/docker.sock:/var/run/docker.sock', 'home-station:/etc/traefik/acme'],
            ExtraHosts: ['host.docker.internal:host-gateway']
        },
        ExposedPorts: {
            '80': {},
            ...(httpsEnabled ? { '443': {} } : {}),
            ...(dev ? { '8080': {} } : {})
        }
    });
    const stream = await proxy.attach({ stream: true, stdout: true, stderr: true });
    stream.setEncoding('utf8');
    stream.pipe(process.stdout);
    proxy.start();
}

export async function stopProxy(): Promise<void> {
    const containers = await containerEngine.listContainers({ all: true });
    const proxies = containers.filter((c) => c.Labels['home-station.proxy'] === 'true');
    for (const proxy of proxies) {
        const proxyContainer = containerEngine.getContainer(proxy.Id);
        await proxyContainer?.stop();
        await proxyContainer?.remove();
    }
}
