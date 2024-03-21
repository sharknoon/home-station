// This script sets up the reverse proxy (traefik) for the home-station app during development.
// NOTE: Use this script only in development. In production, use the docker/traefik.yml file to configure traefik.

import Dockerode from 'dockerode';

try {
    await fetch('http://localhost:2019/config');
} catch (error) {
    console.log('Creating the home-station-traefik container...');
    const dockerode = new Dockerode();
    // Create the home-station network to connect the reverse proxy to the apps
    await dockerode.createNetwork({ Name: 'home-station' }).catch(() => {});
    // Remove the home-station-traefik container if it exists
    await dockerode
        .getContainer('home-station-traefik')
        ?.remove({ force: true })
        .catch(() => {});
    // Run the home-station-traefik container (reverse proxy)
    dockerode.run(
        'traefik:3.0',
        [
            '--global.checknewversion=false',
            '--global.sendAnonymousUsage=false',
            // we are mocking the websecure entrypoint, it isn't actually https
            '--entrypoints.websecure.address=:80',
            '--providers.docker=true',
            '--providers.docker.exposedbydefault=false',
            '--providers.docker.network=home-station',
            '--api=true',
            '--api.dashboard=true'
        ],
        process.stdout,
        {
            name: 'home-station-traefik',
            HostConfig: {
                NetworkMode: 'home-station',
                PortBindings: { '80/tcp': [{ HostPort: '80' }] },
                Binds: ['/var/run/docker.sock:/var/run/docker.sock']
            },
            ExposedPorts: { '80/tcp': {} },
            Labels: {
                'traefik.enable': 'true',
                'traefik.http.routers.traefik.entrypoints': 'websecure',
                'traefik.http.routers.traefik.rule': 'HostRegexp(`^traefik\\.[a-z.]+$`)',
                'traefik.http.routers.traefik.service': 'api@internal'
            }
        },
        {}
    );
}
