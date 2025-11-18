FROM node:18-alpine

# Set working directory
WORKDIR /app

# Ensure node modules binaries are on PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install dependencies first (leveraging Docker cache)
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy app source
COPY . .

# Expose the dev server port
EXPOSE 3000

# Start the React development server (suitable for local/dev use)
CMD ["npm", "start"]
