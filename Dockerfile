FROM nginx:alpine

# Install nvm with node and npm
RUN apk add \
    nodejs \
    npm \
    yarn \
    && echo "NodeJS Version:" "$(node -v)" \
    && echo "NPM Version:" "$(npm -v)" \
    && echo "Yarn Version:" "$(yarn -v)"

WORKDIR /app
COPY . .

RUN chmod +x docker-start.sh

EXPOSE 80

CMD ["/bin/sh", "/app/docker-start.sh"]
