#!/bin/bash
set -e

echo "================================================="
echo "        Installing ServerMG Platform             "
echo "================================================="

INSTALL_DIR="/opt/servermg"
AGENT_KEY="agent_wL4nBqR1tXyUoVzM2fH7kE9jC5dP0sA3gN6vI8bO1mX4c"

echo "[1/4] Installing system dependencies..."
apt-get update -y && apt-get install -y curl wget git jq sshpass

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

echo "[3/4] Cloning ServerMG platform..."
mkdir -p $INSTALL_DIR
cd $INSTALL_DIR

if [ ! -d ".git" ]; then
    git clone https://github.com/immsamyak/serverng.git .
else
    git fetch origin
    git reset --hard origin/main
fi

cat << EOF > .env
NODE_ENV=production
POSTGRES_DB=servermg
POSTGRES_USER=servermg
POSTGRES_PASSWORD=servermg_secure_db_pass_123
REDIS_PASSWORD=servermg_secure_redis_pass_123
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=servermg_secure_mongo_pass_123
MYSQL_ROOT_PASSWORD=servermg_secure_mysql_pass_123
JWT_SECRET=servermg_secure_jwt_secret_change_this_later_v1
JWT_REFRESH_SECRET=servermg_secure_jwt_refresh_secret_change_this_later_v1
AGENT_SECRET=servermg_secure_agent_secret_123
GRAFANA_ADMIN_PASSWORD=admin
API_PORT=4000
DASHBOARD_PORT=3000
AGENT_PORT=4001
AGENT_KEY=${AGENT_KEY}
API_URL=http://api:4000/api
EOF

echo "[4/4] Building and starting services..."
docker compose pull
docker compose up -d postgres redis mongodb mysql
echo "Waiting for databases to initialize..."
sleep 15
docker compose up -d --build api
echo "Waiting for API to initialize..."
sleep 10
docker compose up -d --build agent

echo "================================================="
echo "Installation complete! The platform is running."
echo "================================================="
docker compose ps
