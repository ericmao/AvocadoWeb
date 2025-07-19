#!/bin/bash

# Remote Deployment Script for Avocado.ai Website
# Deploys to Ubuntu server via SSH

set -e

# Server configuration
SERVER_IP="123.193.212.115"
SSH_USER="ubuntu"
SSH_PASS="ubuntu"
DOMAIN="123.193.212.115"  # Using IP as domain for now

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if sshpass is installed
if ! command -v sshpass &> /dev/null; then
    print_status "Installing sshpass..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install sshpass
    else
        # Linux
        sudo apt-get install -y sshpass
    fi
fi

print_status "Starting remote deployment to $SERVER_IP..."

# Test SSH connection
print_status "Testing SSH connection..."
if sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$SSH_USER@$SERVER_IP" "echo 'SSH connection successful'"; then
    print_success "SSH connection established"
else
    print_error "Failed to connect to server. Please check your credentials and network connection."
    exit 1
fi

# Create deployment script for remote server
print_status "Creating remote deployment script..."
cat > remote-setup.sh << 'EOF'
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
sudo apt update && sudo apt upgrade -y

# Install essential packages
print_status "Installing essential packages..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Install Docker
print_status "Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER

# Install Node.js 18.x
print_status "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
print_status "Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
print_status "Setting up PostgreSQL database..."
sudo -u postgres psql -c "CREATE DATABASE avocado_db;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE USER avocado_user WITH PASSWORD 'avocado_password';" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE avocado_db TO avocado_user;" 2>/dev/null || true

# Create application directory
print_status "Setting up application directory..."
sudo mkdir -p /opt/avocado-ai
sudo chown $USER:$USER /opt/avocado-ai

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
sudo tee /etc/systemd/system/avocado-ai.service > /dev/null << 'SERVICEEOF'
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
sudo systemctl enable avocado-ai.service
sudo systemctl start avocado-ai.service

# Setup firewall
print_status "Setting up firewall..."
sudo apt install -y ufw
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

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
EOF

# Copy setup script to server
print_status "Copying setup script to server..."
sshpass -p "$SSH_PASS" scp -o StrictHostKeyChecking=no remote-setup.sh "$SSH_USER@$SERVER_IP:/tmp/"

# Execute setup script on server
print_status "Executing setup script on server..."
sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no "$SSH_USER@$SERVER_IP" "chmod +x /tmp/remote-setup.sh && /tmp/remote-setup.sh"

# Wait for services to start
print_status "Waiting for services to start (this may take a few minutes)..."
sleep 60

# Test the deployment
print_status "Testing deployment..."
if curl -s -f "http://$SERVER_IP" > /dev/null; then
    print_success "Website is accessible!"
else
    print_warning "Website may still be starting up. Please wait a few more minutes."
fi

# Clean up local files
rm -f remote-setup.sh

print_success "Remote deployment completed!"
echo
echo "🌐 Your website is now available at:"
echo "   - Main site: http://$SERVER_IP"
echo "   - Admin panel: http://$SERVER_IP/admin"
echo "   - API: http://$SERVER_IP/api"
echo
echo "🔐 Login credentials:"
echo "   - Admin: admin / admin"
echo "   - Database: avocado_user / avocado_password"
echo
print_warning "Remember to change default passwords in production!"
echo
echo "📊 To monitor your deployment:"
echo "   ssh $SSH_USER@$SERVER_IP"
echo "   sudo systemctl status avocado-ai.service"
echo "   docker ps" 