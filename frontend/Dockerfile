# Etapa 1: Build de Angular
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build -- --configuration production --base-href /planfy/

# Etapa 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/www /usr/share/nginx/html/planfy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
