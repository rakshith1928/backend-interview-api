# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# We must inject the API URL at build time for Vite
ARG VITE_API_URL=http://localhost:5000/api/v1
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Production stage using Nginx
FROM nginx:alpine
# Copy built assets from build stage to nginx serve directory
COPY --from=build /app/dist /usr/share/nginx/html
# Provide a custom nginx config to support React Router SPA fallback
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
