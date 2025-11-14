# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and prisma schema
COPY tsconfig*.json nest-cli.json ./
COPY prisma ./prisma
COPY src ./src

# Generate Prisma client and build Nest app
RUN npx prisma generate
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only required files
COPY package*.json ./
RUN npm ci --omit=dev
COPY prisma ./prisma
# Copy the built artifacts and the generated Prisma client
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/dist ./dist

# Expose API port
EXPOSE 3000

# Run migrations then start the app
CMD npx prisma migrate deploy && node dist/src/main.js
