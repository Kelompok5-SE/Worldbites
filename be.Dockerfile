# Use Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY server/ .

# Expose port 3002
EXPOSE 3011

# Run the application
CMD ["node", "index.js"]
