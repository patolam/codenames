#!/bin/bash
####################################
#
# Servers refresh script
#
####################################

# Kill processes on servers ports
sudo kill -9 $(sudo lsof -t -i:3333)
sudo kill -9 $(sudo lsof -t -i:90)
sudo kill -9 $(sudo lsof -t -i:80)

# Remove node_modules directiory
rm -R ../node_modules

# Run npm install
npm install
