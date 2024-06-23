# Use a specific version of Node as the base image
FROM node:latest as builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy the entire application
COPY . .

# Build the React app
RUN npm run build

# Create a new stage to keep the final image lightweight
FROM node:latest

# Set the working directory for the second stage
WORKDIR /usr/src/app

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/src/app/server ./server
COPY --from=builder /usr/src/app/dist ./server/public/dist

# Change to the server directory
WORKDIR /usr/src/app/server

RUN npm i

# Expose the port that the application listens on
EXPOSE 80

# Run the application
CMD ["node", "index.js"]