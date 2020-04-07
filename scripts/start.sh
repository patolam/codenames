#!/bin/bash
####################################
#
# Servers start script
#
####################################

# Kill processes on servers ports
sudo kill -9 `sudo lsof -t -i:90`
sudo kill -9 `sudo lsof -t -i:3333`
sudo kill -9 `sudo lsof -t -i:80`

# Start Nest.js backend server
forever start ../node_modules/@angular/cli/bin/ng serve api

# Start Angular frontend server
forever start ../node_modules/@angular/cli/bin/ng serve --host=0.0.0.0 --disable-host-check --port 80 --prod
