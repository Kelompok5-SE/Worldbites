# Use Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY client/package*.json ./

# Install dependencies
RUN npm install
RUN npm install slick-carousel
RUN npm install react-slick
RUN npm install react-router-dom
RUN npm install js-cookie
RUN npm install jwt-decode
RUN npm install axios 

# Copy the rest of the application code
COPY client/ .

# Build the React app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the web server
CMD ["npm", "start"]
