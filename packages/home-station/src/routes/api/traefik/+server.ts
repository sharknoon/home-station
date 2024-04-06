import { dev } from '$app/environment';
import { derived, get } from 'svelte/store';
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

/**
 * Generates an easy to read and globally unique name for a service or a router
 * The subdomain is only needed if there are multiple accessible services on the same app
 * @param appId The id of the app used for creating the name
 * @param subdomain An optional subdomain. Only needed when there are multiple http services by an app
 * @returns A new unique name as string
 */
function generateName(appId: string, subdomain?: string): string {
    const [scope, name] = appId.toLowerCase().split(':');
    const newScope = scope.substring(1).replace(/[^a-z0-9]/g, '_');
    return subdomain ? `${newScope}-${name}-${subdomain}` : `${newScope}-${name}`;
}

const configuration = derived(installedApps, async ($installedApps) => {
    const domains = (await db.query.domains.findMany()).map((d) => d.domain);
    const httpsEnabled =
        (await db.query.settings.findFirst({ where: eq(settings.key, 'httpsEnabled') }))?.value ===
        'true';

    const routers: Record<string, object> = {};
    const services: Record<string, object> = {};

    const subdomains = $installedApps.flatMap(
        (app) => app.launchOptions?.map((lo) => lo.subdomain) ?? []
    );
    const duplicateSubdomains = subdomains.filter(
        (value, index, self) => self.indexOf(value) !== index
    );
    const duplicateSubdomainsCounter: Record<string, number> = {};
    for (const subdomain of duplicateSubdomains) {
        duplicateSubdomainsCounter[subdomain] = 0;
    }

    for (const app of $installedApps) {
        const needsFurtherNameSpecification = (app.launchOptions?.length ?? 0) > 1;
        for (const lo of app.launchOptions ?? []) {
            let subdomain = lo.subdomain;
            // If a subdomain is also used by another app, we need to add a number to the subdomain
            if (duplicateSubdomains.includes(subdomain)) {
                duplicateSubdomainsCounter[subdomain]++;
                subdomain = `${subdomain}-${duplicateSubdomainsCounter[subdomain]}`;
            }

            const name = generateName(
                app.id,
                needsFurtherNameSpecification ? subdomain : undefined
            );
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
});

export const GET: RequestHandler = async () => {
    return new Response(JSON.stringify(get(configuration)));
};
