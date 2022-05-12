#!bin/bash

# A script to install the backend structure on a fresh Ubuntu installation.

if [[ "$OSTYPE" =~ ^linux ]]; then
    clear

    echo "Installing Nodejs..."
    sudo apt update -y && curl -fsSL https://deb.nodesource.com/setup_17.x | sudo -E bash - && apt install -y nodejs

    echo "Checking Nodejs installation..."
    node -v
    npm - v

    echo "Installing Yarn..."

    npm install -g yarn

    echo "Checking Yarn installation..."
    yarn -v
    
    echo "Installing Redis..."
    curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

    echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

    sudo apt-get update
    sudo apt-get install redis

    echo "Checking redis installation..."
    redis-cli ping

    echo "Creating bot files..."
    git clone https://github.com/ThatGuyJamal/statistics-hub-oss.git bot

    echo "Installing bot dependencies..."
    cd bot
    cd backend

    yarn install

    echo "Building bot project..."

    bash ./scripts/build.sh

    echo "Install script complete!"

else 
    echo "Your OS is not yet supported..."
    exit 1
fi