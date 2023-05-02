FROM node:latest

# Set the working directory
WORKDIR /app

# Install dependencies for the server and client
RUN apk add --no-cache git \
    && npm install -g nodemon \
    && git clone https://github.com/palls/sitemate-issues-api.git \
    && npm install \
    && npm run build

# Copy the code into the container
COPY ./sitemate-issues-api /app

# Expose the server and client ports
EXPOSE 3000
EXPOSE 8080

# Start the server and client
CMD ["npm", "start"]
