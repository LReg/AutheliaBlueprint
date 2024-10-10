#!/bin/bash

set -e

chmod +x ./setup.sh

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <backend-technologie> <frontend-technologie>"
    exit 1
fi

if [ ! -d "./backend/$1" ]; then
    echo "The Technologie $1 is not supported yet."
    exit 1
fi

if [ ! -d "./frontend/$2" ]; then
    echo "The Technologie $2 not supported yet."
    exit 1
fi

for dir in ./frontend/*/; do
    if [[ $(basename "$dir") != "$2" ]]; then
        rm -rf "$dir"
    fi
done

cp -r  "./frontend/$2"/* ./frontend

rm -rf "./frontend/$2"

for dir in ./backend/*/; do
    if [[ $(basename "$dir") != "$1" ]]; then
        rm -rf "$dir"
    fi
done

cp -r  "./backend/$1"/* ./backend

rm -rf "./backend/$1"