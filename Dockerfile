FROM node:18-alpine3.20

# Create and change to the app directory.
WORKDIR /app

# Copy package files and install dependencies. Using npm ci for clean, reproducible builds.
COPY package*.json ./
RUN npm ci --only=production

# Copy the rest of the application code.
COPY . .

# Create a non-root user and switch to it for security.
USER node

# Expose the port the app runs on.
EXPOSE 8080

# Add a healthcheck to verify the server is responsive.
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD curl -f http://localhost:8080/health || exit 1

CMD ["npm", "start"]