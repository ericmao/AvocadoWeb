#!/bin/bash

# Remote setup script for Ubuntu server
set -e

echo "🚀 Setting up Avocado.ai Website on Ubuntu Server..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Update system
print_status "Updating system packages..."
echo "ubuntu" | sudo -S apt update && echo "ubuntu" | sudo -S apt upgrade -y

# Install essential packages
print_status "Installing essential packages..."
echo "ubuntu" | sudo -S apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Install Docker
print_status "Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | echo "ubuntu" | sudo -S gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | echo "ubuntu" | sudo -S tee /etc/apt/sources.list.d/docker.list > /dev/null
echo "ubuntu" | sudo -S apt update
echo "ubuntu" | sudo -S apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
echo "ubuntu" | sudo -S usermod -aG docker $USER

# Install Node.js 18.x
print_status "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | echo "ubuntu" | sudo -S bash -
echo "ubuntu" | sudo -S apt install -y nodejs

# Install PostgreSQL
print_status "Installing PostgreSQL..."
echo "ubuntu" | sudo -S apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
echo "ubuntu" | sudo -S systemctl start postgresql
echo "ubuntu" | sudo -S systemctl enable postgresql

# Create database and user
print_status "Setting up PostgreSQL database..."
echo "ubuntu" | sudo -S -u postgres psql -c "CREATE DATABASE avocado_db;" 2>/dev/null || true
echo "ubuntu" | sudo -S -u postgres psql -c "CREATE USER avocado_user WITH PASSWORD 'avocado_password';" 2>/dev/null || true
echo "ubuntu" | sudo -S -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE avocado_db TO avocado_user;" 2>/dev/null || true

# Create application directory
print_status "Setting up application directory..."
echo "ubuntu" | sudo -S mkdir -p /opt/avocado-ai
echo "ubuntu" | sudo -S chown $USER:$USER /opt/avocado-ai

# Clone repository
print_status "Cloning repository..."
cd /opt
git clone https://github.com/ericmao/AvocadoWeb.git avocado-ai
cd avocado-ai

# Create environment file
print_status "Setting up environment variables..."
cat > .env << 'ENVEOF'
# Database Configuration
DATABASE_URL=postgresql://avocado_user:avocado_password@localhost:5432/avocado_db

# Backend Configuration
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
SECRET_KEY=your-secret-key-change-this-in-production

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://123.193.212.115

# Admin Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
ENVEOF

# Create production Docker Compose file
print_status "Creating production Docker Compose configuration..."
cat > docker-compose.prod.yml << 'COMPOSEEOF'
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:15
    container_name: avocado_db
    restart: unless-stopped
    environment:
      POSTGRES_DB: avocado_db
      POSTGRES_USER: avocado_user
      POSTGRES_PASSWORD: avocado_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - avocado_network

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: avocado_backend
    restart: unless-stopped
    environment:
      - DATABASE_URL=postgresql://avocado_user:avocado_password@db:5432/avocado_db
      - SECRET_KEY=your-secret-key-change-this-in-production
    ports:
      - "8000:8000"
    depends_on:
      - db
    networks:
      - avocado_network

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: avocado_frontend
    restart: unless-stopped
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - avocado_network

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: avocado_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - avocado_network

volumes:
  postgres_data:

networks:
  avocado_network:
    driver: bridge
COMPOSEEOF

# Create Nginx configuration
print_status "Creating Nginx configuration..."
cat > nginx.conf << 'NGINXEOF'
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:8000;
    }

    server {
        listen 80;
        server_name 123.193.212.115;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Backend API
        location /api/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Admin panel
        location /admin {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
NGINXEOF

# Create backend Dockerfile
print_status "Creating backend Dockerfile..."
cat > backend/Dockerfile << 'BACKENDOF'
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
BACKENDOF

# Create frontend Dockerfile
print_status "Creating frontend Dockerfile..."
cat > frontend/Dockerfile << 'FRONTENDOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
FRONTENDOF

# Create systemd service
print_status "Creating systemd service..."
echo "ubuntu" | sudo -S tee /etc/systemd/system/avocado-ai.service > /dev/null << 'SERVICEEOF'
[Unit]
Description=Avocado.ai Website
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/avocado-ai
ExecStart=/usr/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
SERVICEEOF

# Enable and start service
echo "ubuntu" | sudo -S systemctl enable avocado-ai.service
echo "ubuntu" | sudo -S systemctl start avocado-ai.service

# Setup firewall
print_status "Setting up firewall..."
echo "ubuntu" | sudo -S apt install -y ufw
echo "ubuntu" | sudo -S ufw allow ssh
echo "ubuntu" | sudo -S ufw allow 80
echo "ubuntu" | sudo -S ufw allow 443
echo "ubuntu" | sudo -S ufw --force enable

print_success "Remote setup completed!"
echo
echo "📋 Deployment Status:"
echo "   - Website: http://123.193.212.115"
echo "   - Admin: http://123.193.212.115/admin"
echo "   - API: http://123.193.212.115/api"
echo
echo "🔐 Default credentials:"
echo "   - Admin: admin / admin"
echo "   - Database: avocado_user / avocado_password"
echo
echo "📊 Monitor commands:"
echo "   - Check status: sudo systemctl status avocado-ai.service"
echo "   - View logs: docker logs avocado_backend"
echo "   - Check containers: docker ps"
