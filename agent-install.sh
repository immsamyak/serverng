#!/bin/bash
# ServerMG Agent One-Click Installation Script
# Server: ubuntu-s-1vcpu-2gb-70gb-intel-blr1-01 (159.89.175.178)

set -e

echo "================================================="
echo "        Installing ServerMG Agent...             "
echo "================================================="

export AGENT_KEY="agent_wL4nBqR1tXyUoVzM2fH7kE9jC5dP0sA3gN6vI8bO1mX4c"
export API_URL="https://api.servermg.saamyak.com/api"
export INSTALL_DIR="/opt/servermg"

echo "[1/4] Installing system dependencies..."
if [ -x "$(command -v apt-get)" ]; then
    apt-get update -y
    apt-get install -y curl wget git jq
fi

if ! [ -x "$(command -v docker)" ]; then
    echo "[2/4] Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
else
    echo "[2/4] Docker is already installed."
fi

echo "[3/4] Setting up agent directory at $INSTALL_DIR..."
mkdir -p $INSTALL_DIR
cd $INSTALL_DIR

cat << 'EOF' > docker-compose.yml
version: '3.8'
services:
  servermg-agent:
    image: ghcr.io/saamyak/servermg-agent:latest
    restart: unless-stopped
    network_mode: host
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - AGENT_KEY=${AGENT_KEY}
      - API_URL=${API_URL}
EOF

echo "API_URL=$API_URL" > .env
echo "AGENT_KEY=$AGENT_KEY" >> .env

echo "[4/4] Agent configuration created successfully!"
echo "ServerMG agent configuration is ready in $INSTALL_DIR."
echo "================================================="
echo "Installation complete!"
