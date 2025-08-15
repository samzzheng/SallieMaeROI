# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Install envsubst for environment variable substitution
RUN apk add --no-cache gettext

COPY --from=build /app/build /usr/share/nginx/html

# Create nginx config template
COPY <<EOF /etc/nginx/conf.d/default.conf.template
server {
    listen \${PORT};

    # Serve the static files for the React app
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }

    # Health check endpoint
    location /health {
        return 200 'healthy\n';
        add_header Content-Type text/plain;
    }
}
EOF

# Set default port for Cloud Run
ENV PORT=8080

# Create startup script
COPY <<EOF /docker-entrypoint.sh
#!/bin/sh
envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
EOF

RUN chmod +x /docker-entrypoint.sh

EXPOSE 8080

CMD ["/docker-entrypoint.sh"]