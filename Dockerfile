FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies for root and backend
RUN npm install
# If you have a monorepo structure where backend deps are in root, this is fine. 
# If backend has its own package.json, we need to install there too.
# Based on my analysis, root package.json is backend-focused.

COPY . .

# Generate Prisma Client
WORKDIR /app/backend
RUN npx prisma generate

# Build TypeScript
WORKDIR /app
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
