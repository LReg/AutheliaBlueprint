#!/bin/bash

# Fehlerbehandlung: Beendet das Skript, wenn ein Befehl fehlschlägt
set -e
if [ "$#" -eq 0 ] || [ "$#" -gt 2 ]; then
    echo "Usage: $0 <local|server> [generateSecrets]"
    exit 1
fi

if [ "$1" == "server" ]; then
  SERVER=true
else
  SERVER=false
fi

if [ "$2" == "generateSecrets" ]; then
  GENERATE_SECRETS=true
else
  GENERATE_SECRETS=false
fi

if [ "$SERVER" = true ]; then
    ENV_FILE="./.env.example"
    echo "Kopiere die server setup Datei nach .env"
else
    ENV_FILE="./.env.local"
    echo "Kopiere die local setup Datei nach .env"
fi

cp "$ENV_FILE" "./.env"
ENV_FILE="./.env"

# Prüfen, ob die env-Datei existiert
if [[ ! -f "$ENV_FILE" ]]; then
    echo "Die Datei $ENV_FILE existiert nicht."
    exit 1
fi

chmod +x ./docker/scripts/setSecrets.sh
chmod +x ./docker/scripts/changeEnvVars.sh
chmod +x ./docker/scripts/setJWTPrivateKey.sh

if [ "$GENERATE_SECRETS" = true ]; then
  ./docker/scripts/setSecrets.sh "$ENV_FILE"
fi

if [ "$SERVER" = true ]; then
  ./docker/scripts/changeEnvVars.sh "$ENV_FILE" "./docker/volumes/authelia/config/configuration.template.yml" "./docker/volumes/authelia/config/configuration.yml"
  if [ "$GENERATE_SECRETS" = true ]; then
    ./docker/scripts/setJWTPrivateKey.sh "./docker/volumes/authelia/config/secrets/oidc/jwks/rsa.4096.key"
  fi
fi
./docker/scripts/changeEnvVars.sh "$ENV_FILE" "./docker/scripts/mongo-init.template.js" "./docker/scripts/mongo-init.js"



