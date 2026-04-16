# --- Stage 1: The Builder ---
FROM node:20-alpine AS builder
WORKDIR /build

# 1. Install & build the external extension
RUN npm install directus-extension-sync

# 2. Build your custom extension
# Copy only the files needed for building
COPY ./extensions/djspot-core ./djspot-core
WORKDIR /build/djspot-core
RUN npm install && npm run build

# --- Stage 2: The Final Image ---
FROM directus/directus:11.17.2

# Copy the external extension
COPY --from=builder /build/node_modules/directus-extension-sync /directus/extensions/directus-extension-sync

# Copy only the BUILT custom extension (dist and package.json)
COPY --from=builder /build/djspot-core/dist /directus/extensions/djspot-core/dist
COPY --from=builder /build/djspot-core/package.json /directus/extensions/djspot-core/package.json