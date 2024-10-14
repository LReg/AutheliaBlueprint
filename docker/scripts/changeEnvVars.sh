#!/bin/bash
# Fehlerbehandlung: Beendet das Skript, wenn ein Befehl fehlschlägt
set -e

# Überprüfen, ob genügend Argumente übergeben wurden
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <ENV_FILE> <TEMPLATE_FILE> <DESTINATION_FILE>"
    exit 1
fi

# Dateien
ENV_FILE="$1"
TEMPLATE_FILE="$2"
DESTINATION_FILE="$3"

cp -r "$TEMPLATE_FILE" "$DESTINATION_FILE"

while IFS= read -r line; do
    if [[ "$line" =~ ^[A-Z_]+=[^\"]+ ]]; then
        VAR_NAME=$(echo "$line" | cut -d'=' -f1)
        ENV_FILE_VAR_VALUE=$(echo "$line" | cut -d'=' -f2-)

        #debug
        if [ "$VAR_NAME" == "DOCKER_VOLUME_PATH" ]; then
          if [ -n "${!VAR_NAME}" ]; then
            echo "DOCKER_VOLUME_PATH=${!VAR_NAME} from envvars"
          else
            echo "DOCKER_VOLUME_PATH=$ENV_FILE_VAR_VALUE from .env"
          fi
        fi

        if [ -n "${!VAR_NAME}" ]; then
            VAR_VALUE="${!VAR_NAME}"
        else
            VAR_VALUE="$ENV_FILE_VAR_VALUE"
        fi
        sed -i "s|\$$VAR_NAME|$VAR_VALUE|g" "$DESTINATION_FILE"
    fi
done < "$ENV_FILE"

echo "Konfigurationsdatei $DESTINATION_FILE wurde erfolgreich aktualisiert."
