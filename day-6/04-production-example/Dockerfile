# syntax=docker/dockerfile:1
FROM node:20.14-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build

FROM node:20.14-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1
ENTRYPOINT ["node"]
CMD ["dist/server.js"]
