# Use the official Node.js image as the base image
FROM node:18-slim

# Set environment variables for production
ENV NODE_ENV=production PORT=3500

# Set the working directory in the container
WORKDIR /app

# Copy only package.json and package-lock.json for efficient layer caching
COPY package*.json ./ 

# Install dependencies (production only to reduce image size)
RUN npm ci --production && npm cache clean --force

# Copy the application code to the container
COPY . .

# Ensure proper permissions for files and directories
RUN chown -R node:node /app

# Switch to non-root user for security
USER node

# Expose the application's port (use the same port as specified in the ENV variable)
EXPOSE 3500

# Use tini as the init system for proper signal handling
ENTRYPOINT ["/usr/bin/tini", "--"]

# Start the server
CMD ["nodemon", "server.js"]

# Health check to ensure the app is running
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl --fail http://localhost:3500/health || exit 1
