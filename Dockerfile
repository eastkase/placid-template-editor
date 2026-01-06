# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - serve with Node.js
FROM node:20-alpine

WORKDIR /app

# Install serve package globally
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Railway provides PORT env variable
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the server using serve with dynamic PORT
CMD serve -s dist -l $PORT