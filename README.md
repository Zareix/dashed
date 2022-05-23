# Dashboard

## Using with Docker

To run using docker, run the following command :

```
docker run -d \
        -p 8080:8080 \
        -v ~/dashboard/public:/app/public \
        --name=dashboard \
        ghcr.io/zareix/dashboard:latest
```

or with docker-compose :

```yml
version: "3"
services:
  app:
    image: ghcr.io/zareix/dashboard:latest
    container_name: dashboard
    ports:
      - 8080:8080
    volumes:
      - ./dashboard/public:/app/public
```

You can modify `data.json` file and `assets` folder as you wish.

## Running in dev environment

- Clone the repo
- Copy `data-defaults.json` file from `src/defaults/` to `public/data.json`
- Run `yarn install` to install node dependencies
- Run `yarn dev` to start dev server
- App is running on port 3000
