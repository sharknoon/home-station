FROM oven/bun:1-alpine

COPY index.ts /app/index.ts

ENTRYPOINT [ "bun", "run", "/app/index.ts" ]