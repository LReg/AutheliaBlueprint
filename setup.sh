#!/bin/bash

# Fehlerbehandlung: Beendet das Skript, wenn ein Befehl fehlschlägt
set -e

ENV_FILE="./.env"

# Prüfen, ob die env-Datei existiert
if [[ ! -f "$ENV_FILE" ]]; then
    echo "Die Datei $ENV_FILE existiert nicht."
    exit 1
fi

chmod +x ./reset.sh

chmod +x ./docker/scripts/changeEnvVars.sh
./docker/scripts/changeEnvVars.sh "$ENV_FILE" "./docker/volumes/authelia/config/configuration.yml"
./docker/scripts/changeEnvVars.sh "$ENV_FILE" "./docker/scripts/mongo-init.js"



