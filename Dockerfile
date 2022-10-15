# Pull NodeJS Base Image
FROM node:14.16.0-alpine

# Set Working Directory
WORKDIR /app

# Add node_modules scripts to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install App Dependencies
COPY package.json ./
RUN yarn

# Copy App into the Container
COPY ./ ./

# Start App
CMD ["node", "script.js"]
