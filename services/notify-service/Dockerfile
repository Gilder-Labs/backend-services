FROM node:16 AS pnpm
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
  npm install -g pnpm@7.12.1

FROM pnpm AS builder
WORKDIR /root/monorepo
COPY pnpm-lock.yaml ./
RUN pnpm fetch
ADD . ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
     pnpm install --frozen-lockfile --offline \
     | grep -v "cross-device link not permitted\|Falling back to copying packages from store"
RUN pnpm build:libs

FROM builder AS runner
WORKDIR /root/monorepo
ENV NODE_ENV production
WORKDIR /root/monorepo/services/notify-service
RUN pnpm build
CMD [ "pnpm", "start:prod" ]