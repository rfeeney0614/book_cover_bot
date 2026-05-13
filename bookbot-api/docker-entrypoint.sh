#!/bin/bash
set -e

# Remove pre-existing server.pid for Rails
if [ -f tmp/pids/server.pid ]; then
  rm -f tmp/pids/server.pid
fi

# Execute the container's main command
exec "$@"
