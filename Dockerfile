FROM --platform=linux/amd64 registry.vistara.dev/zara-base:latest AS builder
WORKDIR /app
COPY package*.json ./
USER root
RUN npm install
COPY . .
RUN mkdir -p public
RUN npm run build

FROM --platform=linux/amd64 registry.vistara.dev/zara-base:latest AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
# Create public directory if it doesn't exist
RUN mkdir -p public
COPY --from=builder /app/public ./public
USER appuser
EXPOSE 3000
CMD ["npm", "start"]
