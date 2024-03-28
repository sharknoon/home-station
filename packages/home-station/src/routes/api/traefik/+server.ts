import { dev } from '$app/environment';
import { derived, get } from 'svelte/store';
import type { RequestHandler } from './$types';
import { installedApps } from '$lib/server/apps';

// TODO add a toggle in the ui for HTTPS
// if this toggle is enabled, there should be two new fields editable, email for certificates and the domain(s) for the certificate
// when save, check the certificate if the ip adress if the domain resolves to the same ip adress as our public ip adress

// Generates an easy to read and globally unique name for a service or a router
// The subdomain is only needed if there are multiple accessible services on the same app
function generateName(appId: string, subdomain?: string): string {
    const [scope, name] = appId.split(':');
    const newScope = scope.substring(1).replace(/[^a-z0-9]/g, '_');
    return subdomain ? `${newScope}-${name}-${subdomain}` : `${newScope}-${name}`;
}

const configuration = derived(installedApps, ($installedApps) => {
    const routers: Record<string, object> = {};
    const services: Record<string, object> = {};

    for (const app of $installedApps) {
        const needsFurtherNameSpecification = (app.http?.length ?? 0) > 1;
        for (const h of app.http ?? []) {
            const name = generateName(
                app.id,
                needsFurtherNameSpecification ? h.subdomain : undefined
            );
            routers[name] = {
                entryPoints: ['web'],
                service: name,
                rule: `Host(\`${h.subdomain}.localhost\`)`
            };
            services[name] = {
                loadBalancer: {
                    servers: [
                        {
                            url: `http://${app.hostname}:${h.port}`
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
                    entryPoints: ['web'],
                    service: 'home-station',
                    rule: 'Host(`localhost`)'
                },
                traefik: {
                    entryPoints: ['traefik'],
                    service: 'api@internal',
                    rule: 'Host(`localhost`) && (PathPrefix(`/api`) || PathPrefix(`/dashboard`))'
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
