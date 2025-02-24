# Use an official Node.js image as base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for efficient caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project into the container
COPY . .

# Build the React app
RUN npm run build

# Install a lightweight HTTP server
RUN npm install -g serve

# Expose port 3000 (default React app port)
EXPOSE 3003

# Start the React app using 'serve'
CMD ["serve", "-s", "build","-l", "3003"]
