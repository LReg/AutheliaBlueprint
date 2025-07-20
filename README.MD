# Authelia Blueprint
This Blueprint consists of a fullstack application with Authelia as the authentication provider.\
The Project includes scripts and a fully prepared dockerized setup to speed up the initial setup process.\
Choose your Technologies: Angular, Vue, Go-Backend, Node-Backend.\
## Documentation
The steps to complete are described in the [Documentation](https://lreg.github.io/AutheliaBlueprint/).
## The Idea
To configure a project with an external Authentication provider, like Authelia, there are many steps to take.\
Generating secrets, configuring the Authelia instance, configuring the database, configuring the frontend and backend, and setting up the reverse proxy.\
This Blueprint is designed to make this process as easy as possible.\
This is done by providing a setup script that generates secrets and replaces placeholders in the configuration files.\
And with the help of the documentation and the provided docker-compose files, the setup can be done in about 15 minutes.
## Features
- Fullstack Application with Authelia as the authentication provider
- Choose your Technologies: Angular, Vue, Go-Backend, Node-Backend
- Fully dockerized
- Configurable with .env file
- Configurable with environment variables via pipeline
- Setup script to generate secrets and replace placeholders
- Documentation to guide you through the setup
- Reverse Proxy Traefik