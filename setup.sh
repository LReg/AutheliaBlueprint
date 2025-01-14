#!/bin/bash

# Fehlerbehandlung: Beendet das Skript, wenn ein Befehl fehlschlägt
set -e
if [ "$#" -gt 1 ]; then
    echo "Usage: $0 [init]"
    exit 1
fi

ENV_FILE="./.env"

if [ "$1" == "init" ]; then
  INIT=true
else
  INIT=false
fi

# create .env file if it does not exist
if [ ! -f "$ENV_FILE" ]; then
    cp "./.env.example" "./.env"
    echo "Kopiere die server setup Datei nach .env"
fi

if [ ! -f "$ENV_FILE" ]; then
    echo "Die Datei $ENV_FILE existiert nicht."
    exit 1
fi


# stuff that just needs to be done once
if [ "$INIT" == true ]; then
  chmod +x ./docker/scripts/setSecrets.sh
  chmod +x ./docker/scripts/changeEnvVars.sh
  chmod +x ./docker/scripts/setJWTPrivateKey.sh
  chmod +x ./docker-cli.sh
  chmod +x ./docker/scripts/getEnv.sh
  DOCKER_PATH=$(./docker/scripts/getEnv.sh "$ENV_FILE" DOCKER_VOLUME_PATH)
  ./docker/scripts/setSecrets.sh "$ENV_FILE"

  # generate jwt private key for authelia
  mkdir -p "$DOCKER_PATH/volumes/authelia/config/secrets/oidc/jwks"
  ./docker/scripts/setJWTPrivateKey.sh "$DOCKER_PATH/volumes/authelia/config/secrets/oidc/jwks/rsa.4096.key"
fi

DOCKER_PATH=$(./docker/scripts/getEnv.sh "$ENV_FILE" DOCKER_VOLUME_PATH)
# write authelia config file
mkdir -p "$DOCKER_PATH/volumes/authelia/config"
./docker/scripts/changeEnvVars.sh "$ENV_FILE" "./docker/templateFiles/configuration.template.yml" "$DOCKER_PATH/volumes/authelia/config/configuration.yml"

# write mongo init file
mkdir -p "$DOCKER_PATH/scripts"
./docker/scripts/changeEnvVars.sh "$ENV_FILE" "./docker/templateFiles/mongo-init.template.js" "$DOCKER_PATH/scripts/mongo-init.js"
