FROM --platform=linux/amd64 registry.vistara.dev/zara-base:latest AS builder
WORKDIR /app
COPY package*.json ./
USER root
COPY . .
RUN npm i && npm run build

FROM --platform=linux/amd64 registry.vistara.dev/zara-base:latest AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
USER appuser
EXPOSE 3000
CMD ["npm", "start"]
