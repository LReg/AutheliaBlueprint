set -e


if [ ! -f "./.env" ]; then
    echo "File ./.env is missing, please execute setup script first, see documentation."
fi

if [ "$#" -ne 2 ] && [ "$#" -ne 3 ]; then
    echo "Usage: $0 <up|down|build> <db|frontend|backend|auth|traefik> [local]"
    exit 1
fi

if [ "$3" == "local" ]; then
  LOCAL=true
  if [ "$2" != "db" ] && [ "$2" != "backend" ]; then
    echo "Local mode is only supported for db and backend"
    exit 1
  fi
else
  LOCAL=false
fi

# Local execution
if [ $LOCAL == true ]; then
  if [ "$1" == "down" ] || [ "$1" == "build" ]; then
    docker compose -f docker/composeFiles/local.docker-compose.yml --env-file ./.env "$1" "$2"
  else
    docker compose -f docker/composeFiles/local.docker-compose.yml --env-file ./.env "$1" "$2" -d
  fi

elif [ "$1" == "down" ] || [ "$1" == "build" ]; then
  # Build and down

  if [ "$2" == "traefik" ]; then
    docker compose -f docker/composeFiles/traefik.docker-compose.yml --env-file ./.env "$1"
  fi
  if [ "$2" == "auth" ]; then
    docker compose -f docker/composeFiles/auth.docker-compose.yml --env-file ./.env "$1"
  fi
  if [ "$2" == "frontend" ] || [ "$2" == "backend" ] || [ "$2" == "db" ]; then
    docker compose -f docker/composeFiles/app.docker-compose.yml --env-file ./.env "$1" "$2"
  fi

elif [ "$1" == "up" ]; then
  # up with some extra tags

  if [ "$2" == "traefik" ]; then
    docker compose -f docker/composeFiles/traefik.docker-compose.yml --env-file ./.env "$1" -d --force-recreate
  fi
  if [ "$2" == "auth" ]; then
    docker compose -f docker/composeFiles/auth.docker-compose.yml --env-file ./.env "$1" -d --force-recreate --wait --wait-timeout 120
  fi
  if [ "$2" == "frontend" ] || [ "$2" == "backend" ] || [ "$2" == "db" ]; then
    docker compose -f docker/composeFiles/app.docker-compose.yml --env-file ./.env "$1" "$2" -d --force-recreate
  fi

fi


