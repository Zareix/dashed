FROM node:lts-alpine

RUN yarn global add servor

WORKDIR /app
COPY . .
COPY public/data-default.json public/data.json

RUN chmod +x docker-start.sh

EXPOSE 8080

CMD ["sh", "/app/docker-start.sh"]
