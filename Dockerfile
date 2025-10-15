# Use Node image built for ARM (works with Raspberry Pi)
FROM node:20-bullseye

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy bot source
COPY . .

# Run the build step (this creates the dist folder)
RUN npm run build

# Copy any additional files needed at runtime (like data files)
RUN cp -r src/data /usr/src/app/dist/data

# Expose port if needed (not for Discord bots, typically)
# EXPOSE 3000

# Run the bot
CMD ["node", "dist/index.js"]
