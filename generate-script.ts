import * as fs from 'fs';
import * as path from 'path';

const agentKey = 'agent_wL4nBqR1tXyUoVzM2fH7kE9jC5dP0sA3gN6vI8bO1mX4c';
const serverName = 'ubuntu-s-1vcpu-2gb-70gb-intel-blr1-01';
const serverIp = '159.89.175.178';
const apiUrl = 'https://api.servermg.saamyak.com/api'; // Mock domain

const script = `#!/bin/bash
# ServerMG Agent One-Click Installation Script
# Server: ${serverName} (${serverIp})
# This script will install Docker, Node.js (if needed), and set up the ServerMG agent.

set -e

echo "================================================="
echo "        Installing ServerMG Agent...             "
echo "================================================="

export AGENT_KEY="${agentKey}"
export API_URL="${apiUrl}"
export INSTALL_DIR="/opt/servermg"

# 1. Update packages and install dependencies
echo "[1/4] Installing system dependencies..."
if [ -x "$(command -v apt-get)" ]; then
    apt-get update -y
    apt-get install -y curl wget git jq
elif [ -x "$(command -v yum)" ]; then
    yum update -y
    yum install -y curl wget git jq
else
    echo "Unsupported OS. Only Debian/Ubuntu and RHEL/CentOS are natively supported by this script for now."
fi

# 2. Install Docker if not present
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

# 3. Create agent directory
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
      - AGENT_KEY=\${AGENT_KEY}
      - API_URL=\${API_URL}
EOF

echo "API_URL=$API_URL" > .env
echo "AGENT_KEY=$AGENT_KEY" >> .env

echo "[4/4] Agent configuration created successfully!"
echo "ServerMG agent configuration is ready in $INSTALL_DIR."
echo "================================================="
echo "Installation complete!"

# echo "Starting agent..."
# docker-compose up -d
`;

fs.writeFileSync(path.join(__dirname, 'agent-install.sh'), script);
console.log('Generated agent-install.sh');
