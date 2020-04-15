#!/bin/bash
####################################
#
# Servers start script
#
####################################

# Kill processes on servers ports
fuser -k -n tcp 90
fuser -k -n tcp 3333
fuser -k -n tcp 80

cd ..

chown boldare -R dist

# Start Nest.js backend server
sudo forever start node_modules/@angular/cli/bin/ng serve api

# Start Angular frontend server
sudo forever start node_modules/@angular/cli/bin/ng serve --host=0.0.0.0 --disable-host-check --port 80 --prod

cd scripts
