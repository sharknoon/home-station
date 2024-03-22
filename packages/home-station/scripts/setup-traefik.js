// This script sets up the reverse proxy (traefik) for the home-station app during development.
// NOTE: Use this script only in development. In production, use the docker/traefik.yml file to configure traefik.

import { exec } from 'node:child_process';
import { promisify } from 'node:util';

try {
    await fetch('http://localhost');
} catch (error) {
    console.log('Creating the home-station-traefik container...');
    const execAsync = promisify(exec);
    await execAsync('docker network create home-station').catch(() => {});
    await execAsync('docker rm -f home-station-traefik').catch(() => {});
    await execAsync(
        'docker run -d --name home-station-traefik ' +
            '--network home-station ' +
            '-p 80:80 ' +
            '-v /var/run/docker.sock:/var/run/docker.sock ' +
            '-l traefik.enable=true ' +
            '-l traefik.http.routers.traefik.entrypoints=websecure ' +
            '-l "traefik.http.routers.traefik.rule=Host(\\"localhost\\")" ' +
            '-l traefik.http.routers.traefik.service=api@internal ' +
            'traefik:3.0 ' +
            '--global.checknewversion=false ' +
            '--global.sendAnonymousUsage=false ' +
            '--entrypoints.websecure.address=:80 ' +
            '--providers.docker=true ' +
            '--providers.docker.exposedbydefault=false ' +
            '--providers.docker.network=home-station ' +
            '--providers.docker.allowEmptyServices=true ' +
            '--api=true ' +
            '--api.dashboard=true ' +
            '--log.level=DEBUG'
    );
}
