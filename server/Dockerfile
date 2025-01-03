# Use the official Node.js image as the base image
FROM node:18-slim

# Set environment variables for production
ENV NODE_ENV=production PORT=5000

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json for efficient layer caching
COPY package*.json ./

# Install dependencies (production only to reduce image size)
RUN npm install --production && npm cache clean --force

# Copy the application code to the container
COPY . .

# Ensure proper permissions for files and directories
RUN chown -R node:node /usr/src/app

# Switch to non-root user for security
USER node

# Expose the application's port
EXPOSE 5000

# Use tini as the init system for proper signal handling
ENTRYPOINT ["/usr/bin/tini", "--"]

# Start the server
CMD ["node", "server.js"]

# Optionally, add a healthcheck to ensure your app is running
# A healthcheck periodically checks if the app is still responding
# This helps Docker detect if the container is in a bad state.
# It’s a good idea to have this in production.

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl --fail http://localhost:5000/ || exit 1
