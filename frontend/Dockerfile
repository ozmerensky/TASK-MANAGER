# Frontend multi-stage Dockerfile
# Builds the Vite app and serves it with nginx in production

FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies (use lockfile if available)
COPY package*.json ./
RUN npm ci

# Copy sources and build
COPY . .
RUN npm run build

FROM nginx:stable-alpine
# Copy built assets to nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]