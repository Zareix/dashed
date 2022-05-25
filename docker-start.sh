#!/bin/sh

# Nginx
echo ">> Starting nginx"
nginx -g "daemon off;" &

# App
echo ">> Installing packages"
yarn install
if [ ! -e /app/dist ]; then
    echo ">> Creating dist folder"
    mkdir -p /app/dist
fi
if [ ! -e /app/public ]; then
    echo ">> Creating public folder"
    mkdir -p /app/public
fi
if [ ! -e /app/public/assets ]; then    
    echo ">> Creating assets folder"
    mkdir -p /app/public/assets
fi
if [ ! -e /app/public/app ]; then
    echo ">> Creating default app assets folder"
    cp -r /app/src/defaults/app /app/public/app
fi
if [ ! -e /app/public/data.json ]; then
    echo ">> Creating default data.json file"
    cp /app/src/defaults/data.json /app/public/data.json
fi
echo ">> Running server"
yarn build:docker &

# Api
cd server
echo ">> Installing packages"
yarn install
yarn start