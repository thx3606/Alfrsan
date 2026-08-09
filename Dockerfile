# Local development / staging parity image. Production deployment must be
# a separately hardened pipeline (see DEPLOYMENT notes in ROADMAP.md) —
# this Dockerfile is not a production hardening exercise by itself.

FROM node:22-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runtime
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 khibra && adduser --system --uid 1001 khibra
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma
USER khibra
EXPOSE 3000
CMD ["npm", "start"]
