# Use the official Node.js image as the base image
FROM node:18-slim

# Set environment variables for production
ENV NODE_ENV=production PORT=5000

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json for efficient layer caching
COPY package*.json ./

# Install dependencies
RUN npm install --production && npm cache clean --force

# Copy the application code to the container
COPY . .

# Ensure proper permissions for files and directories
RUN chown -R node:node /usr/src/app

# Switch to non-root user for security
USER node

# Expose the application's port
# EXPOSE $PORT
EXPOSE 5000

# Use tini as the init system for proper signal handling
RUN apt-get update && apt-get install -y tini && apt-get clean
ENTRYPOINT ["/usr/bin/tini", "--"]

# Start the server
CMD ["node", "server.js"]
