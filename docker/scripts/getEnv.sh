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
        if [ "$VAR_NAME" == "$SEARCH_VAR_NAME" ]; then
          ENV_FILE_VAR_VALUE=$(echo "$line" | cut -d'=' -f2-)
                  if [ -n "${!VAR_NAME}" ]; then
                      VAR_VALUE="${!VAR_NAME}"
                  else
                      VAR_VALUE="$ENV_FILE_VAR_VALUE"
                  fi
                  echo "$VAR_VALUE"
                  exit 0
        fi
    fi
done < "$ENV_FILE"
exit 1