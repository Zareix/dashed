#!/bin/sh

if [ ! -e /app/node_modules ]; then
    echo ">> Installing packages"
    yarn install
fi
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
if [ ! -e /app/public/data.json ]; then
    echo ">> Creating default data.json file"
    cp /app/src/defaults/data-default.json /app/public/data.json
fi
echo ">> Running server"
servor dist --reload &
yarn build