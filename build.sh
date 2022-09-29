#!/usr/bin/env bash

docker build -t ticket-api ./ticketApi $1
docker build -t ticket-app ./ticketApp $1
docker build -t wayfarer-db ./wayfarerDB $1
docker build -t wayfarer-oauth ./wayfarerOAuth $1
docker build -t wayfarer-oauth-db ./wayfarerOAuthDB $1