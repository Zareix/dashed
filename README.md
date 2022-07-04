# Dashed

Dashed is selfhosted dashboard for your homelab.

See how to use it in our [wiki](https://github.com/Zareix/dashed/wiki)

## Using with Docker 🐳

To run using docker, run the following command :

```
docker run -d \
        -p 80:80 \
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
      - 80:80
    volumes:
      - ./dashboard/public:/app/public
```

You can modify `data.json` file and `assets` folder as you wish.
