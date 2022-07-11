#!/bin/sh

# Nginx
echo ">> Starting nginx"
cp /app/nginx/starting/index.html /usr/share/nginx/html/index.html
if [[ -z "${USE_SSL}" ]]; then
    cp /app/nginx/http.conf /etc/nginx/conf.d/default.conf
else
    cp /app/nginx/https.conf /etc/nginx/conf.d/default.conf
fi
nginx -g "daemon off;" | sed -e 's/^/[NGINX] /;' > /app/nginx/.logs &

# Setup app
if [ ! -e /app/client/public ]; then
    echo ">> Creating public folder"
    mkdir -p /app/client/public
fi
if [ ! -e /app/client/public/assets ]; then    
    echo ">> Creating assets folder"
    mkdir -p /app/client/public/assets
fi
if [ ! -e /app/client/public/data.json ]; then
    echo ">> Creating default data.json file"
    cp /app/defaults/data.json /app/client/public/data.json
fi
echo ">> Copying default app assets"
cp -nr /app/defaults/app /app/client/public

echo ">> Installing packages"
yarn install
echo ">> Running app"
yarn docker:start
