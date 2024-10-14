set -e

if [ ! -f "./.env" ]; then
    echo "File ./.env is missing, please execute setup script first, see documentation."
fi

if [ "$#" -ne 2 ] && [ "$#" -ne 3 ]; then
    echo "Usage: $0 <db|frontend|backend|auth|traefik> <up|down|build|logs> [local]"
    exit 1
fi

if [ "$3" == "local" ]; then
  LOCAL=true
  if [ "$1" != "db" ] && [ "$1" != "backend" ]; then
    echo "Local mode is only supported for db and backend"
    exit 1
  fi
else
  LOCAL=false
fi

if [ $LOCAL == true ]; then
  # Local execution

  docker compose -f docker/composeFiles/local.docker-compose.yml --env-file ./.env "$2" "$1"

elif [ "$2" == "down" ] || [ "$2" == "build" ]; then
  # Build and down

  if [ "$1" == "traefik" ]; then
    docker compose -f docker/composeFiles/traefik.docker-compose.yml --env-file ./.env "$2"
  fi
  if [ "$1" == "auth" ]; then
    docker compose -f docker/composeFiles/auth.docker-compose.yml --env-file ./.env "$2"
  fi
  if [ "$1" == "frontend" ] || [ "$1" == "backend" ] || [ "$1" == "db" ]; then
    docker compose -f docker/composeFiles/app.docker-compose.yml --env-file ./.env "$2" "$1"
  fi

elif [ "$2" == "up" ]; then
  # up with some extra tags

  if [ "$1" == "traefik" ]; then
    docker compose -f docker/composeFiles/traefik.docker-compose.yml --env-file ./.env "$2" -d
  fi
  if [ "$1" == "auth" ]; then
    docker compose -f docker/composeFiles/auth.docker-compose.yml --env-file ./.env "$2" -d --force-recreate --wait --wait-timeout 120
  fi
  if [ "$1" == "frontend" ] || [ "$1" == "backend" ] || [ "$1" == "db" ]; then
    docker compose -f docker/composeFiles/app.docker-compose.yml --env-file ../../.env "$2" "$1" -d
  fi

fi


