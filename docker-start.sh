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
if [ ! -e /usr/share/nginx/html/assets ]; then    
    echo ">> Creating assets folder"
    mkdir -p /usr/share/nginx/html/assets
    echo ">> Copying default assets"
    cp -r /app/defaults/assets /usr/share/nginx/html
fi
if [ ! -e /app/data.json ]; then
    echo ">> Creating default data.json file"
    cp /app/defaults/data.json /app/data.json
fi

# Run
echo ">> Running api"
yarn start
