# Dashed

Dashed is selfhosted dashboard for your homelab.

See how to use it in our [wiki](https://github.com/Zareix/dashed/wiki)

## Using with Docker 🐳

To run using docker, run the following command :

```bash
docker run -d \
        -p 80:80 \
        -v ~/dashboard/assets:/usr/share/nginx/html/assets \
        -v ~/dashboard/data.json:/app/data.json \
        --name=dashboard \
        ghcr.io/zareix/dashed:latest
```

or with docker-compose :

```yml
version: "3"
services:
  app:
    image: ghcr.io/zareix/dashed:latest
    container_name: dashboard
    ports:
      - 80:80
    volumes:
      - ./dashboard/assets:/usr/share/nginx/html/assets
      - ./dashboard/data.json:/app/data.json
```

### Notes on volumes

- `assets/` : all images assets such as icons
- `data.json` : config file (Optional since you can modify it in real time via the config page). If you map it, be sure to create it first or docker will create a folder instead.

## Use ssl 🔐

Bind a folder containing `cert.pem` (your certificate) and `private.pem` (your private key). Then add the `USE_SSL` env variable

```bash
docker run -d \
        -p 443:443 \
        -v ~/dashboard/assets:/usr/share/nginx/html/assets \
        -v ~/dashboard/data.json:/app/data.json \
        -v ~/dashboard/certs:/app/nginx/certs \
        -e USE_SSL=true \
        --name=dashboard \
        ghcr.io/zareix/dashed:latest
```
