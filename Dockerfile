FROM --platform=linux/amd64 node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
# Use npm install instead of npm ci if package-lock.json doesn't exist
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy application code
COPY . .

# Create .env file from .env.example if it doesn't exist
RUN if [ ! -f .env ]; then \
    echo "Creating .env file from .env.example with placeholder values"; \
    cp .env.example .env && \
    sed -i 's/your_privy_app_id/placeholder_privy_app_id/g' .env && \
    sed -i 's/your_pinata_api_key/placeholder_pinata_api_key/g' .env && \
    sed -i 's/your_pinata_secret_key/placeholder_pinata_secret_key/g' .env && \
    sed -i 's/your_openai_api_key/placeholder_openai_api_key/g' .env && \
    sed -i 's/your_neynar_api_key/placeholder_neynar_api_key/g' .env; \
fi

# Build application
RUN npm run build

# Production image
FROM --platform=linux/amd64 node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/next.config.js ./
# Copy public directory if it exists
RUN mkdir -p ./public
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Create a non-root user and switch to it
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

# Start the application
CMD ["npm", "start"]
