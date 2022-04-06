#!/bin/bash

if [ ! -e /app/node_modules ]; then
    yarn install
fi
if [ ! -e /app/dist ]; then
    mkdir -p /app/dist
fi
if [ ! -e /app/public ]; then
    mkdir -p /app/public
fi
if [ ! -e /app/public/assets ]; then
    mkdir -p /app/public/assets
fi
if [ ! -e /app/public/data.json ]; then
    cp /app/src/defaults/data-default.json /app/public/data.json
fi
servor dist --reload &
yarn build