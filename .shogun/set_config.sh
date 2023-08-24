#!/bin/sh
echo "Setting REACT_APP_API_ORIGIN to $REACT_APP_API_ORIGIN"
sed -i "s|REACT_APP_API_ORIGIN_PLACEHOLDER|$REACT_APP_API_ORIGIN|g" /usr/share/nginx/html/config.json
