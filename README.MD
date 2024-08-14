# Authelia Fullstack Blueprint
This Blueprint consists of a fullstack application with Authelia as the authentication provider.
It is fully configurable in the .env file, which should take about 15 minutes.

Currently, it only works via. a .env file, but im planning to make it configurable via envvars for better pipline usage.

It has a go backend and an angular frontend.
The backend is protected by Authelia and the frontend is protected by the backend.
As DB mongodb is configured.

Everything is dockerized
# Setup
## First startup
Important to note:
On the first startup the lldap user that authelia will want to use will not exsist.
So you will need to login to lldap on you lldap.youdomain.com (LLDAP_DOMAIN) and login with admin:password and then create the user you defined in your .env File.
The user should have the groupl ldap_password_manager. And of course change the admin password. For futher information look into the [lldap Repo](https://github.com/lldap/lldap), very good project.
## Setup on server
``` sh
git clone project
cd project
cp .env.example .env # update accordingly
chmod +x ./setup.sh
./setup.sh
docker run -u "$(id -u):$(id -g)" -v "$(pwd)":/keys authelia/authelia:latest authelia crypto pair rsa generate --bits 4096 --directory /keys
copy the content of the private key to `docker/volumes/authelia/config/secrets/oidc/jwks/rsa.4096.key`
docker compose up -d
```
## Local setup
### Database
For the local configuration, I configured it in a way to only run frontend backend and db locally. And access your databse.
``` sh
git clone project
cd project
cp .env.local .env # some values need to be filled for the backend 
chmod +x ./localSetup.sh
./localSetup.sh # needed to fill the mongdb script placeholders
docker compose -f local.docker-compose.yml up -d mongodb# only starts the db
```
### frontend
1. update the frontend/src/environments/environment.ts file (clientId, auth url)
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
### Change values in the .env file
When calling the setup.sh script some of the env variables will get copied to the authelia configuration file.

That means when you change them after you will need to reset the config files, because the placeholders are gone.

This can be done by calling the reset.sh script.

It is necessary to call it with sudo, because authelia changes permissions to the file.
```sudo ./reset.sh``` 

# Environment Variables
There will be some secrets that you need to generate and copy to the .env file.
Here is a helper page from authelia you can use https://www.authelia.com/reference/guides/generating-secure-values/#generating-a-random-alphanumeric-string
### General
- APP_NAME=YourAppName : Used to avoid nameconflics
- ROOT_DOMAIN=yourdomain.com
- APP_DOMAIN=app.youdomain.com : domain to access the fontend
- AUTH_DOMAIN=auth.youdomain.com : authelia auth domain
- LLDAP_DOMAIN=ldap.yourdomain.com : you can configure your users in the lldap Frontend here

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
- LLDAP_PURE_DOMAIN=yourdomain
- LLDAP_DC=com
- LLDAP_JWT_SECRET=super-secret-jwt : **generate secret**
- LLDAP_KEY_SEED=super-secret-seed : **generate secret**
- LLDAP_USERNAME=authelia
- LLDAP_PASSWORD=secret-password : **generate secret**
 
 ### Authelia storage (postgres)
- POSTGRES_PASSWORD=super-secret-password : **generate secret**
- POSTGRES_ENCRYPTION_KEY=super-secret-encryption-key : **generate secret**
 
 ### OIDC
- OIDC_HMAC_SECRET='super-secret-hmac' : **generate secret**
- OIDC_CLIENT_ID='your-client-id'
- OIDC_CLIENT_NAME=your-client-name
- OIDC_CALLBACK_URL=https://app.yourdomain.com/callback : the callback url you define in the frontend
- OIDC_LOCALHOST_CALLBACK=http://localhost:4200/callback
- OIDC_LOCALHOST_ORIGIN=http://localhost:4200
 
 ### Database
- DB_ROOT_USERNAME=root
- DB_ROOT_PASSWORD=root-password : **generate secret**
- DB_USERNAME=db-username
- DB_PASSWORD=db-password : **generate secret**
 
 ### Frontend
- FRONTEND_BASE_URL=https://app.yourdomain.com
- FRONTEND_API_URL=https://app.yourdomain.com/api
- FRONTEND_AUTH_URL=https://auth.yourdomain.com
 
### SMTP
- SMTP_USERNAME=user
- SMTP_PASSWORD=password : **generate secret**
- SMTP_HOST=smtp://smtp.gmail.com:587
- SMTP_SENDER=mail@app.de
In case you selfhost your mailserver there might be some problems with the certs. Then you can experiment with these values.
- SMTP_DISABLE_REQUIRE_TLS=false
- SMTP_DISABLE_STARTTLS=false
- SMTP_SKIP_TLS_VERIFY=false
