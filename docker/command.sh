#!/bin/bash

# Start traefik
# The configuration file should be autodetected, it is specified just for clarity
traefik --config-file /etc/traefik/traefik.yaml &

# Start home-station
# Set the default type to module skip a package.json file with { "type": "module" }
node --experimental-default-type=module /app/build/index.js &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?