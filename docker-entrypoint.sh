#!/bin/sh

# Replace $PORT placeholder with actual PORT environment variable
envsubst '$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx
nginx -g 'daemon off;'