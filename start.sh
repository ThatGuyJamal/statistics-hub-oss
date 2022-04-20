#!/bin/bash    

# Making sure nodejs is installed on the server
curl -fsSL https://deb.nodesource.com/setup_17.x | sudo -E bash -
sudo apt-get install -y nodejs

# Checking the version of nodejs installed
node --version

#  Installing and running the app
npm install
npm run compile
npm run start

bash