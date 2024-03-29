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

chown root -R dist

# Start Nest.js backend server
# sudo forever start node_modules/@angular/cli/bin/ng serve api
sudo forever start node dist/apps/api/main.js

# Start Angular frontend server
# sudo forever start node_modules/@angular/cli/bin/ng serve --host=0.0.0.0 --disable-host-check --port 80
sudo forever start node angular.js

cd scripts
