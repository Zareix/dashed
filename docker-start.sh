#!/bin/bash

if [[ ! -e /app/dist ]]; then
    mkdir -p /app/dist
fi
servor dist --reload &
yarn build