#!/bin/bash

# generates secrets for each "SECRET" string in the given .env file
# Syntax has to be: VARNAME=SECRET
# Requirement: openssl
# Fehlerbehandlung: Beendet das Skript, wenn ein Befehl fehlschlägt

set -e

# Überprüfen, ob genügend Argumente übergeben wurden
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <ENV_FILE>"
    exit 1
fi

# Dateien
ENV_FILE="$1"
LINE_NUMBER=0

while IFS= read -r line; do
    LINE_NUMBER=$((LINE_NUMBER+1))
    if [[ "$line" =~ ^[A-Z_]+=[^\"]+ ]]; then
        VAR_NAME=$(echo "$line" | cut -d'=' -f1)
        ENV_FILE_VAR_VALUE=$(echo "$line" | cut -d'=' -f2-)

        if [ "$ENV_FILE_VAR_VALUE" == "!SECRET" ]; then
            SECRET=$(openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c 64)
            VAR_VALUE="${!VAR_NAME}"
            sed -i "${LINE_NUMBER}s/!SECRET/${SECRET}/" $ENV_FILE
        fi
    fi
done < "$ENV_FILE"

echo "Secrets have successfully been written to  $ENV_FILE."
