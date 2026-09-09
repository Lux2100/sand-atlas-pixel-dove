#!/bin/sh
cd /workspace || exit 1
if curl -sf -o /dev/null http://127.0.0.1:8080/; then
  exit 0
fi
npm run dev > /tmp/aura-dev.log 2>&1 &
i=1
while [ "$i" -le 20 ]; do
  if curl -sf -o /dev/null http://127.0.0.1:8080/; then
    exit 0
  fi
  sleep 1
  i=$((i + 1))
done
exit 0
