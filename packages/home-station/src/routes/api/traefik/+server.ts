import { dev } from '$app/environment';
import { derived, get } from 'svelte/store';
import type { RequestHandler } from './$types';
import { installedApps } from '$lib/server/apps';

const host = 'localhost';
const appRouters = derived(installedApps, ($installedApps) => {
    return $installedApps.flatMap((app) => {
        return (app.http ?? []).map((h) => {
            return {
                [app.uuid]: {
                    entryPoints: [dev ? 'web' : 'websecure'],
                    service: app.uuid,
                    rule: dev ? `Host(\`${h.subdomain}.localhost\`)` : `Host(\`${h.subdomain}.${host}\`)`
                }
            };
        });
    });
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
                }
            }
        }
    };
    return new Response(JSON.stringify(configuration));
};
