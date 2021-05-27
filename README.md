# wayfarer
Wayfarer Training Federation target organization

# scripted build and deployment
1. `./build.sh` this will create the docker images for each part of the stack, as well as fetching application dependencies.
1. Review the configuration in `default.env`. Any overrides can go into `.env` using the same variable names as their default counterparts.
1. `./deploy.sh` will deploy the stack. You need to have initialized docker swarm (or use `docker swarm init` to do so). 

# manual build and deployment
1. `cd ticketApi` from project root, cd into the *ticketApi* directory.
1. `docker build -t ticket-api .` build the ticket-api image.
1. `cd ../ticketApp` cd into the *ticketApp* directory.
1. `docker build -t ticket-app .` build the ticket-app image.
1. `cd ../wayfarerDB` cd into the *wayfarerDB* directory.
1. `docker build -t wayfarer-db .` build the db image.
1. `cd ..` change to the project root
1. `docker swarm init` initialize docker swarm
1. `docker stack deploy -c docker-compose.yml wayfarer-ticket` deploy the stack.

# stopping the stack
`docker stack rm wayfarer-ticket`
