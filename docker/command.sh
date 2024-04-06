#!/bin/bash

# Start traefik
# Use the custom configuration file from /data
traefik --config-file /data/traefik.yml &

# Start home-station
# Set the default type to module skip a package.json file with { "type": "module" }
node --experimental-default-type=module /app/build/index.js &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?