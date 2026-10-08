# syntax=docker/dockerfile:1

FROM node:24-alpine AS base

ENV PNPM_HOME=/pnpm \
	COREPACK_HOME=/home/node/.cache/node/corepack \
	PATH=/pnpm:$PATH

WORKDIR /app

RUN mkdir -p /pnpm /home/node/.cache/node/corepack \
	&& apk upgrade --no-cache \
	&& corepack enable \
	&& corepack prepare pnpm@10.34.6 --activate \
	&& rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx \
	&& chown -R node:node /app /pnpm /home/node/.cache/node

USER node

FROM base AS dependencies

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN --mount=type=cache,id=ds-lib-pnpm-store,target=/pnpm/store,uid=1000,gid=1000 \
	HUSKY=0 pnpm install --frozen-lockfile --store-dir=/pnpm/store

FROM dependencies AS build

COPY --chown=node:node . .

RUN pnpm run build && STORYBOOK_DISABLE_TELEMETRY=1 pnpm run build-storybook

FROM dependencies AS development

COPY --chown=node:node . .

ENV NODE_ENV=development \
	HOST=0.0.0.0 \
	VITE_PORT=5173 \
	STORYBOOK_PORT=3000

EXPOSE 5173 3000

CMD ["pnpm", "exec", "vite", "--host", "0.0.0.0", "--port", "5173"]

FROM nginx:1.30.5-alpine3.24-slim AS web-runtime

RUN apk upgrade --no-cache

COPY nginx.conf /etc/nginx/nginx.conf

USER nginx

EXPOSE 8080

ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]

FROM web-runtime AS preview

COPY --from=build /app/dist/ /usr/share/nginx/html/

FROM web-runtime AS runtime

COPY --from=build /app/storybook-static/ /usr/share/nginx/html/
