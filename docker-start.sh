#!/bin/bash

if [[ ! -e /app/node_modules ]]; then
    yarn install
fi
if [[ ! -e /app/dist ]]; then
    mkdir -p /app/dist
fi
servor dist --reload &
yarn build