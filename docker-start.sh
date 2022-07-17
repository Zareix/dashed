#!/bin/sh

# Nginx
echo ">> Starting nginx"
if [[ -z "${USE_SSL}" ]]; then
    cp /app/nginx/http.conf /etc/nginx/conf.d/default.conf
else
    cp /app/nginx/https.conf /etc/nginx/conf.d/default.conf
fi
nginx -g "daemon off;" | sed -e 's/^/[NGINX] /;' > /app/nginx/.logs &

# Set defaults
echo ">> Creating assets folder"
mkdir -p /usr/share/nginx/html/assets
echo ">> Copying default assets"
rsync -r --ignore-existing /app/defaults/assets /usr/share/nginx/html
if [ ! -e /app/data.json ]; then
    echo ">> Creating default data.json file"
    cp /app/defaults/data.json /app/data.json
fi

# Run
echo ">> Running api"
yarn start
