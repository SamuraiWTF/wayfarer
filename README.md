# wayfarer
Wayfarer Training Federation target organization

# build
1. `cd ticketApi` from project root, cd into the *ticketApi* directory.
1. `docker build -t ticket-api .` build the ticket-api image.
1. `cd ../ticketApp` cd into the *ticketApp* directory.
1. `docker build -t ticket-app .` build the ticket-app image.
1. `cd ..` change to the project root
1. `docker swarm init` initialize docker swarm
1. `docker stack deploy -c docker-compose.yml wayfarer-ticket` deploy the stack.

# stopping the stack
`docker stack rm wayfarer-ticket`