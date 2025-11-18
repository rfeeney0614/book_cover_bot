FROM node:18-alpine

# Set working directory
WORKDIR /app

# Ensure node modules binaries are on PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install dependencies first (leveraging Docker cache)
COPY package.json package-lock.json ./
# Use a recent npm 11.x to match the host lockfile format and avoid lockfile-parsing
# issues that can appear across npm major versions.
RUN npm install -g npm@11.6.2
# Show npm output during build to aid debugging in CI/container environments
RUN npm ci

# Copy app source
COPY . .

# Expose the dev server port
EXPOSE 3000

# Start the React development server (suitable for local/dev use)
CMD ["npm", "start"]
