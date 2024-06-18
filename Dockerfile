# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the SvelteKit application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Define environment variables
ENV NODE_ENV=production
ENV PUBLIC_PROD_DATA_DIR=/data

# Start the application
CMD ["npm", "run", "preview"]
