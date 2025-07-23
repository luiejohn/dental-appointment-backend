#!/usr/bin/env sh
# wait-for-it.sh from https://github.com/vishnubob/wait-for-it

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

until nc -z "$host" "$port"; do
  echo "Waiting for $host:$port..."
  sleep 1
done

echo "$host:$port is available — launching command"
exec $cmd
