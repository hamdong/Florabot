# Build & Test
FROM node:22-bullseye AS builder

WORKDIR /usr/src/app

COPY package*.json ./
# Install everything (including Jest)
RUN npm install

COPY . .

# Run tests
RUN npm test

# Build the TypeScript project
RUN npm run build

# Production
FROM node:22-bullseye

WORKDIR /usr/src/app

COPY package*.json ./
# Install ONLY production dependencies (--omit=dev)
RUN npm install --omit=dev

# Copy only the compiled code from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Run the bot
CMD ["node", "dist/index.js"]
