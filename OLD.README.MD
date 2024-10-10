# Authelia Fullstack Blueprint
This Blueprint consists of a fullstack application with Authelia as the authentication provider.
It is fully configurable in the .env file, which should take about 15 minutes.

When you have Environment Variables exported while using the setup.sh script, it will use them, rather than the .env file.

It has a go backend and an angular frontend. The Reverse Proxy is Traefik.
The backend is protected by Authelia and the frontend is protected by the backend.
As DB mongodb is configured.

Everything is dockerized.

# Setup
## General Idea
Everything should be configurable in the .env file OR in the environment variables. The environment variables will overwrite the .env file.

Authelia and the database need config file and startup script. They are written with placeholders. The setup.sh script will replace them with the values from the .env file.

After executing the setup.sh script you can consider all values in your .env and envvars to be set as "global config".

The setup needs to be done before the build because the frontend needs values at buildtime.

You can think of your .env and envvars as a global config, which will be used in diffrent places:
docker-compose file, authelia config, database startup script, frontend build, backend envvars.

The idea of the local setup will be to only have the frontend, backend and db running locally and to use the remote authelia.
## Setup.sh
The setup.sh script is used to generate secrets and to replace placeholders in the authelia configuration file and the database startup script.
You will need to work on you .env file anyway tho.
Usage: 
``` sh
chmod +x ./setup.sh
#        server or local | generateSecrets is optional 
./setup.sh <server|local> [generateSecrets]
```

In more detail the setup script does the following:
- copies either the .env.example or the .env.local file to the .env file
- copies the authelia template configuration file
- generates secrets for the .env file (optional on generate secrets)
- generates a rsa key for the authelia configuration (optional on generate secrets)
- replaces the placeholders in the authelia configuration with the values from the .env file
- replaces the placeholders in the database startup script with the values from the .env file
### Pitfalls with setup.sh
The setup.sh takes the authelia config template and replaces the placeholders with the values from the .env file.

After the first start the config file is owned by root. So you need to call the setup.sh with sudo.
Maybe I will find a better solution for this in the future.

If you are not planning on changing any of the configuration values anymore,
you can also extract the setup.sh script to another pipeline and remove it from the main deploy pipeline.
Tho it is important to still have the env vars because they are read in the docker-compose file.
## First startup
Important to note:
On the first startup the lldap user that authelia will want to use will not exist. This will lead to the authelia container to be unhealthy and restarting.

So you will need to login to lldap on you lldap.youdomain.com (LLDAP_DOMAIN) and login with admin:password and then create the user you defined in your .env File.

The user should have the group ldap_password_manager. And of course change the admin password. For futher information look into the [lldap Repo](https://github.com/lldap/lldap), very good project.
## Setup on server
``` sh
git clone project
cd project
chmod +x ./setup.sh
./setup.sh server generateSecrets
# update the .env file
docker compose up -d
```

### Traefik is already configured what should I do?
If you already have traefik running and blocking your ports you can user the no-traefik.docker-compose.yml.
````bash
docker compose -f no-traefik.docker-compose.yml up -d
````
You have to put in the correct values in the .env file for Entrypoint, Network and CertResolver.
### Pipeline usage
In the folder .github/workflows there is a github Actions pipeline predefined. It leverages the Action secrets to pull all configuration values.

The example pipeline uses some bad practices by building on the server it will run on. This is because I personally don't consider it that bad for a small project.

Before the first running of the pipeline you need to:
- create a user on your server
- give the user access to: docker, (sudo), ssh -> sudo see pitfalls with setup.sh
- clone the repository on the server
- give the ./setup.sh script execution rights
- execute the setup.sh script with the generateSecrets argument
- depending on weather you want to use envvars or the .env file you will need to update the .env file or your pipeline

After that the setup.sh will only need to run when you have changes in your .env or environment variables.
But if your pipeline should react to such variable changes then it would make sense to run it.
But you should not add the generateSecrets to the setup.sh script because it would regenerate all secrets and break your system.
## Local setup
### Database
For the local configuration, I configured it in a way to only run frontend backend and db locally. And access your authelia running on your server.
``` sh
git clone project
cd project
cp .env.local .env # some values need to be filled for the backend (clientId and auth-domain) 
chmod +x ./localSetup.sh
./localSetup.sh local # needed to fill the mongdb script placeholders
docker compose -f local.docker-compose.yml up -d mongodb # only starts the db
```
### frontend
1. update the frontend/src/environments/environment.ts file (clientId, auth url; same as .env file)
2. start frontend
``` sh
cd frontend
npm install
npm start
```
### backend
since the backend is relying on environment variables I would recommend to run it with docker.
``` sh
docker compose -f local.docker-compose.yml build backend
docker compose -f local.docker-compose.yml up backend
```
# Configuration in .env file
There will be some secrets that you need to generate and copy to the .env file.
Here is a helper page from authelia you can use to generate secrets in case you dont want to do it with the setup.sh script: https://www.authelia.com/reference/guides/generating-secure-values/#generating-a-random-alphanumeric-string
### General
- APP_NAME=YourAppName : Used to avoid nameconflics, added for example to container names

example for https://app.yourdomain.com
- DOMAIN=yourdomain
- D_ENDING=com : Domain ending
- AUTH_SUBDOMAIN=auth : Subdomain for authelia -> https://auth.yourdomain.com
- LDAP_SUBDOMAIN=ldap : Subdomain for you ldap (user management) -> https://ldap.yourdomain.com

- CALLBACK_PATH=home : The path where the frontend will redirect to after login (must fit exactly with that you program in the frontend)

### Traefik (mainly to avoid name conflicts)
Maybe you already have a treafik instance running, then you can delete it from the docker-compose file and use the existing one.
- TRAEFIK_NETWORK=YourTraefikNetwork
- TRAEFIK_CERT_RESOLVER=YourCertResolver
- TRAEFIK_ENTRYPOINT=YourHttpsEntryPoint
- TRAEFIK_EMAIL=YourEmail@gmail.com
 
### Authelia
- AUTHELIA_RESET_PASSWORD_SECRET=super-secret-password : **generate secret** 
- AUTHELIA_SESSION_REDIS_PASSWORD=redis-password : **generate secret**
- AUTHELIA_SESSION_SECRET=super-secret-session : **generate secret**
 
 ### Authelia authentication backend (Light Ldap)
- LLDAP_JWT_SECRET=super-secret-jwt : **generate secret**
- LLDAP_KEY_SEED=super-secret-seed : **generate secret**
- LLDAP_USERNAME=authelia : these are the credentials for the lldap user. You will need to add a user to lldap with these.
- LLDAP_PASSWORD=secret-password : **generate secret**
 
 ### Authelia storage (postgres)
- POSTGRES_PASSWORD=super-secret-password : **generate secret**
- POSTGRES_ENCRYPTION_KEY=super-secret-encryption-key : **generate secret**
 
 ### OIDC
- OIDC_HMAC_SECRET=super-secret-hmac : **generate secret**
- OIDC_CLIENT_ID=your-client-id
- OIDC_CLIENT_NAME=your-client-name
 
### Database
- DB_ROOT_USERNAME=root
- DB_ROOT_PASSWORD=root-password : **generate secret**
- DB_USERNAME=db-username
- DB_PASSWORD=db-password : **generate secret**
 
### SMTP
- SMTP_USERNAME=user
- SMTP_PASSWORD=password : **generate secret**
- SMTP_HOST=smtp://smtp.gmail.com:587 : don't forget to use protocol and port
- SMTP_SENDER=mail@app.de

In case you selfhost your mailserver there might be some problems with the certs. Then you can experiment with these values.
- SMTP_DISABLE_REQUIRE_TLS=false
- SMTP_DISABLE_STARTTLS=false
- SMTP_SKIP_TLS_VERIFY=false
