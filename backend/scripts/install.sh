#!bin/bash

if [[ "$OSTYPE" =~ ^linux ]]; then
    clear
    echo "[INSTALL-SCRIPT-GHOSTCORD] Installing dependencies for GhostCord..."
    yarn install
    echo "[INSTALL-SCRIPT-GHOSTCORD] Dependencies installed."
    echo "[INSTALL-SCRIPT-GHOSTCORD] You can now run the build script."
else 
    echo "[INSTALL-SCRIPT-GHOSTCORD] Your OS is not yet supported..."
    exit 1
fi