#!/bin/bash

# Fehlerbehandlung: Beendet das Skript, wenn ein Befehl fehlschlägt
set -e
if [ "$#" == 1 ] || [ "$#" -gt 2 ]; then
  echo "Usage: $0 [init <volume_storage_path>]"
  exit 1
fi

ENV_FILE="./.env"

if [ "$1" == "init" ]; then
  INIT=true
  # Volume_storage_path
  VSP="$2"
else
  INIT=false
fi

# if no .env file exists and we are not in init mode, exit
if [ ! -f "$ENV_FILE" ] && [ "$INIT" == false ]; then
    echo "Die Datei $ENV_FILE existiert nicht. Please use ./setup.sh init <volume_storage_path>."
    exit 1
fi

# create .env file if it does not exist
if [ ! -f "$ENV_FILE" ] && [ "$INIT" == true ]; then
    cp "./.env.example" "./.env"
    echo "Copy .env.example to  .env"
fi

if [ ! -f "$ENV_FILE" ]; then
    echo "The file $ENV_FILE does not exsist."
    exit 1
fi

# stuff that just needs to be done once
if [ "$INIT" == true ]; then
  chmod +x ./docker/scripts/setSecrets.sh
  chmod +x ./docker/scripts/changeEnvVars.sh
  chmod +x ./docker/scripts/setJWTPrivateKey.sh
  chmod +x ./docker-cli.sh
  chmod +x ./docker/scripts/getEnv.sh
  ./docker/scripts/setSecrets.sh "$ENV_FILE"
  sed -i "s|!VSP|$VSP|" "$ENV_FILE"

  # generate jwt private key for authelia
  DOCKER_PATH=$(./docker/scripts/getEnv.sh "$ENV_FILE" DOCKER_VOLUME_PATH)
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
