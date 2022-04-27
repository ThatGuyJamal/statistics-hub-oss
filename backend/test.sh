#!/bin/bash

#     Statistics Hub OSS - A data analytics discord bot.
    
#     Copyright (C) 2022, ThatGuyJamal and contributors
#     This program is free software: you can redistribute it and/or modify
#     it under the terms of the GNU Affero General Public License as
#     published by the Free Software Foundation, either version 3 of the
#     License, or (at your option) any later version.
#     This program is distributed in the hope that it will be useful,
#     but WITHOUT ANY WARRANTY; without even the implied warranty of
#     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
#     GNU Affero General Public License for more details.

# The dir to check for
DIR="out/"
# The argument flag - dev
FLAG=$1

echo "Starting run script..."

# check if the out dir exists
if [ -d "$DIR" ]; then 
  # If it does, delete it before running the rest of the script
  echo "The out directory exists, continuing deletion..."
  rm -rf "./$DIR"
  echo "Deleted out directory, continuing..."
  yarn run compile
  echo "Compilation finished. continuing..."
  runProcess()
else
  # If it doesn't, run the rest of the script
  echo "The out directory doesn't exist, continuing compilation of typescript files..."
  yarn run compile
  @echo "Compilation finished, continuing..."
  runProcess()
fi


function runProcess() {
    if [ "$FLAG" = "dev" ]; then
    echo "Running in development mode..."
    yarn run start:development
  else
    echo "Running in production mode..."
    yarn start
  fi
}