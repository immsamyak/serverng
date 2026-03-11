import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { PrismaService } from './prisma/prisma.service';

@ApiTags('Install')
@Controller('install')
export class InstallController {
    constructor(private prisma: PrismaService) { }

    @Get(':agentKey')
    @ApiOperation({ summary: 'Get the one-click installation script for a server agent' })
    async getInstallScript(@Param('agentKey') agentKey: string, @Req() req: Request, @Res() res: Response) {
        // Verify key exists
        const server = await this.prisma.server.findUnique({ where: { agentKey } });
        if (!server) {
            return res.status(404).send('echo "Server not found or invalid agent key."');
        }

        const apiUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}/api`;

        const script = `#!/bin/bash
# ServerMG Agent One-Click Installation Script
# Server: ${server.name} (${server.ipAddress})
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

# Using a standalone node binary or pulling docker image for agent (Placeholder for actual implementation)
# For now, we simulate agent installation completion:

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

# echo "Pulling agent image and starting..."
# docker-compose up -d

echo "[4/4] Agent configuration created successfully!"
echo "ServerMG agent configuration is ready in $INSTALL_DIR."
echo "Note: The actual agent image/package is currently a placeholder and needs to be published."
echo "================================================="
echo "Installation complete!"
`;

        res.setHeader('Content-Type', 'text/x-shellscript');
        res.setHeader('Content-Disposition', 'attachment; filename="install.sh"');
        res.send(script);
    }
}
