FROM node:17

RUN yarn global add servor

WORKDIR /app
COPY . .
RUN chmod +x docker-start.sh

EXPOSE 8080

CMD ["sh", "/app/docker-start.sh"]
