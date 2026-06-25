# Build Step
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production

# Serve Step (using Nginx)
FROM nginx:alpine
COPY --from=build /app/dist/temp-angularapp /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
