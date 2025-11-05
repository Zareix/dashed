# Dashed

testDashed is selfhosted dashboard for your homelab. It's designed to be dead simple to use and setup, while still offering a admin interface to edit the dashboard.

See how to use it in our [wiki](https://github.com/Zareix/dashed/wiki)

## Using with Docker 🐳

To run using docker, run the following command :

```bash
docker run -d \
        -p 3000:3000 \
        -v ./db_data:/app/db \
        --name=dashboard \
        ghcr.io/zareix/dashed:latest
```

or with docker-compose :

```yml
services:
  app:
    image: ghcr.io/zareix/dashed:latest
    container_name: dashboard
    ports:
      - 3000:3000
    volumes:
      - ./db_data:/app/db
```

### Notes on volumes

- `db/` : this folder will contain the database (a sqlite file)
