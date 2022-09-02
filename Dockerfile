# --- BUILD STAGE ---
FROM nginx:alpine AS build

RUN apk add \
    nodejs \
    npm \
    yarn

WORKDIR /app/client
COPY ./client/package.json package.json
RUN yarn install
COPY ./client .
RUN yarn build

# --- APP SETUP STAGE ---
FROM nginx:alpine
RUN apk add \
    nodejs \
    npm \
    yarn \
    rsync

WORKDIR /app
COPY ./nginx ./nginx
COPY ./defaults ./defaults

WORKDIR /app/server
COPY ./server/package.json package.json
RUN yarn install
COPY ./server .

COPY ./docker-start.sh /app/docker-start.sh
RUN chmod +x /app/docker-start.sh

COPY --from=build /app/client/dist /usr/share/nginx/html

EXPOSE 80

CMD ["/bin/sh", "/app/docker-start.sh"]
