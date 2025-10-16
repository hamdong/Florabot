# Use Node image built for ARM (works with Raspberry Pi)
FROM node:22-bullseye

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy bot source
COPY . .

# Run the build step (this creates the dist folder)
RUN npm run build

# Expose port if needed (not for Discord bots, typically)
# EXPOSE 3000

# Run the bot
CMD ["node", "dist/index.js"]
