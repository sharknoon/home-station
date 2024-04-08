import { dev } from '$app/environment';
import { get } from 'svelte/store';
import type { RequestHandler } from './$types';
import { installedApps } from '$lib/server/apps';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { settings } from '$lib/server/schema';

// This is the main configuration endpoint for traefik. More information here:
// https://doc.traefik.io/traefik/v3.0/routing/overview/

/**
 * Generates the TLS section of the router specification
 * https://doc.traefik.io/traefik/v3.0/routing/routers/#tls
 * @param domains The domains to be added
 * @param subdomain An optional subdomain to be added
 * @returns A TLS section of the router configuration
 */
function generateTLSSection(domains: string[], subdomain?: string): object {
    return {
        tls: {
            domains: domains.map((domain) => ({
                main: subdomain ? `${subdomain}.${domain}` : domain
            }))
        }
    };
}

async function generateConfiguration() {
    const apps = get(installedApps);
    const domains = (await db.query.domains.findMany()).map((d) => d.domain);
    // Dev and https are mutally exclusive
    const httpsEnabled =
        !dev &&
        (await db.query.settings.findFirst({ where: eq(settings.key, 'httpsEnabled') }))?.value ===
            'true';

    const routers: Record<string, object> = {};
    const services: Record<string, object> = {};

    const subdomains = apps.flatMap((app) => app.launchOptions?.map((lo) => lo.subdomain) ?? []);
    const duplicateSubdomains = subdomains.filter(
        (value, index, self) => self.indexOf(value) !== index
    );
    const duplicateSubdomainsCounter: Record<string, number> = {};
    for (const subdomain of duplicateSubdomains) {
        duplicateSubdomainsCounter[subdomain] = 0;
    }

    const names = apps.map((app) => app.id.split(':')[1]);
    const duplicateNames = names.filter((value, index, self) => self.indexOf(value) !== index);
    const duplicateNamesCounter: Record<string, number> = {};
    for (const name of duplicateNames) {
        duplicateNamesCounter[name] = 0;
    }

    for (const app of apps) {
        for (const lo of app.launchOptions ?? []) {
            let subdomain = lo.subdomain;
            let name = app.id.split(':')[1];
            // If a subdomain is also used by another app, we need to add a number to the subdomain
            if (duplicateSubdomains.includes(subdomain)) {
                duplicateSubdomainsCounter[subdomain]++;
                subdomain = `${subdomain}-${duplicateSubdomainsCounter[subdomain]}`;
            }
            // Instead of having the whole id as router / service name, we increase the number after the app name
            if (duplicateNames.includes(name)) {
                duplicateNamesCounter[name]++;
                name = `${name}-${duplicateNamesCounter[name]}`;
            }

            routers[name] = {
                entryPoints: [httpsEnabled ? 'websecure' : 'web'],
                service: name,
                // Match the subdomain on every domain
                rule: `HostRegexp(\`^${subdomain}\\..+$\`)`,
                ...(httpsEnabled ? generateTLSSection(domains, subdomain) : {})
            };
            services[name] = {
                loadBalancer: {
                    servers: [
                        {
                            url: `http://${lo.hostname}:${lo.port}`
                        }
                    ]
                }
            };
        }
    }

    return {
        http: {
            routers: {
                'home-station': {
                    entryPoints: [httpsEnabled ? 'websecure' : 'web'],
                    service: 'home-station',
                    rule: 'HostRegexp(`.+`)',
                    priority: 1,
                    ...(httpsEnabled ? generateTLSSection(domains) : {})
                },
                traefik: {
                    entryPoints: ['traefik'],
                    service: 'api@internal',
                    rule: 'HostRegexp(`.+`) && (PathPrefix(`/api`) || PathPrefix(`/dashboard`))'
                },
                ...routers
            },
            services: {
                'home-station': {
                    loadBalancer: {
                        servers: [
                            {
                                url: dev
                                    ? 'http://host.docker.internal:5173'
                                    : 'http://localhost:3000'
                            }
                        ]
                    }
                },
                ...services
            }
        }
    };
}

export const GET: RequestHandler = async () => {
    return new Response(JSON.stringify(await generateConfiguration()));
};
