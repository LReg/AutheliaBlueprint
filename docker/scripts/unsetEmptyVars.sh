#!/bin/bash

set -e

# Überprüfen, ob genügend Argumente übergeben wurden
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <ENV_FILE>"
    exit 1
fi

# Dateien
ENV_FILE="$1"
LINE_NUMBER=0

echo "Unsetting empty variables in $ENV_FILE"

while IFS= read -r line; do
    LINE_NUMBER=$((LINE_NUMBER+1))
    if [[ "$line" =~ ^[A-Z_]+=[^\"]+ ]]; then
        VAR_NAME=$(echo "$line" | cut -d'=' -f1)

      echo "Checking $VAR_NAME"
      echo "Content is ${!VAR_NAME}"

      if [ -n "${!VAR_NAME}" ] || [ "${!VAR_NAME}" == "" ]; then
        unset "$VAR_NAME"
        echo "Unset $VAR_NAME"
      fi
    fi
done < "$ENV_FILE"