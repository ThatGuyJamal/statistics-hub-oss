#!bin/bash

DIR="out/"

echo "Starting run.sh"

clear

echo "..."

# Check if the emited javascript exitst in the project.
# If it does, remove it else continue with the execution.

if [[ "$OSTYPE" =~ ^darwin ]]; then
    echo "[BUILD-SCRIPT] Not yet supported..."
    exit 1
fi

if [[ "$OSTYPE" =~ ^windows ]]; then
    echo "[BUILD-SCRIPT] Not yet supported..."
    exit 1
fi

if [[ "$OSTYPE" =~ ^linux ]]; then
    if [ -d "$DIR" ]; then 
  echo "[BUILD-SCRIPT] Removing old emited files..."
  rm -rf "../$DIR" # Removes the dir, this only works in unix based systems.
  echo "[BUILD-SCRIPT] Files removed, continuing with the build..."
  yarn run compile # Builds the typescript files.
  echo "[BUILD-SCRIPT] Build script successfully executed."
else
  echo "[BUILD-SCRIPT] Building a fresh project..."
  yarn run compile # Builds the typescript files.
  echo "[BUILD-SCRIPT] Build script successfully executed."
  fi
fi