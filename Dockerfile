FROM --platform=linux/amd64 registry.vistara.dev/zara-base:latest AS builder
WORKDIR /app
COPY package*.json ./
USER root
COPY . .
RUN npm i && npm run build

FROM --platform=linux/amd64 registry.vistara.dev/zara-base:latest AS runner
WORKDIR /app
# Environment variables
ENV NODE_ENV=production
# Linear API key (passed as build arg)
ARG LINEAR_API_KEY
ENV LINEAR_API_KEY=$LINEAR_API_KEY
COPY --from=builder /app/dist ./dist
USER appuser
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
