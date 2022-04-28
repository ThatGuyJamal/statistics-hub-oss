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

echo "Starting run script..."

# check if the out dir exists
if [ -d "$DIR" ]; then 
  # If it does, delete it before running the rest of the script
  echo "The out directory exists, continuing deletion..."
  rm -rf "./$DIR"
  echo "Deleted out directory, continuing..."
  yarn run compile
    # Clears the console before running the rest of the script
  clear
  echo "Compilation finished. Starting bot process..."
  npm run start
else
  # If it doesn't, run the rest of the script
  echo "The out directory doesn't exist, continuing compilation of typescript files..."
  yarn run compile
  # Clears the console before running the rest of the script
  clear
  @echo "Compilation finished, running the bot process..."
  npm run start
fi

