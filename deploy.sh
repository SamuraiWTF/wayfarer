#!/usr/bin/env bash

export $(cat default.env) > /dev/null 2>&1; export $(cat .env) > /dev/null 2>&1; docker stack deploy -c stack.yml wayfarer 