import { dev } from '$app/environment';
import { derived, get } from 'svelte/store';
import type { RequestHandler } from './$types';
import { installedApps } from '$lib/server/apps';

const host = 'localhost';

const appRouters = derived(installedApps, ($installedApps) => {
    const routers: Record<string, object> = {};
    for (const app of $installedApps) {
        for (const h of app.http ?? []) {
            routers[`${app.uuid}-${h.subdomain}`] = {
                entryPoints: [dev ? 'web' : 'websecure'],
                service: `${app.uuid}-${h.subdomain}`,
                rule: dev ? `Host(\`${h.subdomain}.localhost\`)` : `Host(\`${h.subdomain}.${host}\`)`
            };
        }
    }
    return routers;
});

const appServices = derived(installedApps, ($installedApps) => {
    const services: Record<string, object> = {};
    for (const app of $installedApps) {
        for (const h of app.http ?? []) {
            services[`${app.uuid}-${h.subdomain}`] = {
                loadBalancer: {
                    servers: [
                        {
                            url: `http://${app.uuid}:${h.port}`
                        }
                    ]
                }
            };
        }
    }
    return services;
});

export const GET: RequestHandler = async () => {
    const configuration = {
        http: {
            routers: {
                'home-station': {
                    entryPoints: [dev ? 'web' : 'websecure'],
                    service: 'home-station',
                    rule: dev ? 'Host(`localhost`)' : `Host(\`${host}\`)`
                },
                api: {
                    entryPoints: ['api'],
                    service: 'api@internal',
                    rule: 'Host(`localhost`) && (PathPrefix(`/api`) || PathPrefix(`/dashboard`))'
                },
                ...get(appRouters)
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
                ...get(appServices)
            }
        }
    };
    return new Response(JSON.stringify(configuration));
};
