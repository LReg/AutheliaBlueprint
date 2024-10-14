#!/bin/bash

set -e

# Überprüfen, ob genügend Argumente übergeben wurden
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <ENV_FILE> <VAR_NAME>"
    exit 1
fi

# Dateien
ENV_FILE="$1"
SEARCH_VAR_NAME="$2"
while IFS= read -r line; do
    if [[ "$line" =~ ^[A-Z_]+=[^\"]+ ]]; then
        VAR_NAME=$(echo "$line" | cut -d'=' -f1)

    fi
done < "$ENV_FILE"
exit 1