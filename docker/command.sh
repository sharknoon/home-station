#!/bin/bash

# Start traefik
traefik --config-file /app/traefik.yml &

# Start home-station
node --experimental-default-type=module /app/build/index.js &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?