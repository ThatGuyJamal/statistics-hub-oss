#!/bin/bash    

# Checking the version of nodejs installed
nodev = node --version

echo "Current Node version is $nodev"

#  Installing and running the app
npm install
npm run compile
npm run start

bash