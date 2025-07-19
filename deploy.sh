#!/bin/bash

# Avocado.ai Website Deployment Script for Ubuntu 24.04
# This script will deploy the full stack application

set -e  # Exit on any error

echo "🚀 Starting Avocado.ai Website Deployment on Ubuntu 24.04..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

# Update system packages
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
print_warning "You need to log out and back in for docker group changes to take effect."

# Install Node.js 18.x
print_status "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python 3.11 and pip
print_status "Installing Python 3.11..."
sudo apt install -y python3.11 python3.11-venv python3.11-dev python3-pip

# Install PostgreSQL
print_status "Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
print_status "Setting up PostgreSQL database..."
sudo -u postgres psql -c "CREATE DATABASE avocado_db;"
sudo -u postgres psql -c "CREATE USER avocado_user WITH PASSWORD 'avocado_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE avocado_db TO avocado_user;"
sudo -u postgres psql -c "ALTER USER avocado_user CREATEDB;"

# Install Nginx
print_status "Installing Nginx..."
sudo apt install -y nginx

# Create application directory
print_status "Setting up application directory..."
sudo mkdir -p /opt/avocado-ai
sudo chown $USER:$USER /opt/avocado-ai

# Copy application files
print_status "Copying application files..."
cp -r . /opt/avocado-ai/
cd /opt/avocado-ai

# Set up environment variables
print_status "Setting up environment variables..."
cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://avocado_user:avocado_password@localhost:5432/avocado_db

# Backend Configuration
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
SECRET_KEY=your-secret-key-change-this-in-production

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://your-domain.com

# Admin Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
EOF

# Create production Docker Compose file
print_status "Creating production Docker Compose configuration..."
cat > docker-compose.prod.yml << EOF
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
    ports:
      - "5432:5432"
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
    volumes:
      - ./backend:/app

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
    volumes:
      - ./frontend:/app
      - /app/node_modules

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
EOF

# Create Nginx configuration
print_status "Creating Nginx configuration..."
cat > nginx.conf << EOF
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
        server_name your-domain.com www.your-domain.com;

        # Redirect HTTP to HTTPS
        return 301 https://\$server_name\$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com www.your-domain.com;

        # SSL Configuration (you'll need to add your certificates)
        # ssl_certificate /etc/nginx/ssl/cert.pem;
        # ssl_certificate_key /etc/nginx/ssl/key.pem;

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
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_cache_bypass \$http_upgrade;
        }

        # Backend API
        location /api/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_cache_bypass \$http_upgrade;
        }

        # Admin panel
        location /admin {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_cache_bypass \$http_upgrade;
        }
    }
}
EOF

# Create backend Dockerfile
print_status "Creating backend Dockerfile..."
cat > backend/Dockerfile << EOF
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
EOF

# Create frontend Dockerfile
print_status "Creating frontend Dockerfile..."
cat > frontend/Dockerfile << EOF
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
EOF

# Create systemd service files
print_status "Creating systemd service files..."
sudo tee /etc/systemd/system/avocado-ai.service > /dev/null << EOF
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
EOF

# Enable and start the service
sudo systemctl enable avocado-ai.service



# Create monitoring script
print_status "Creating monitoring script..."
cat > monitor.sh << 'EOF'
#!/bin/bash

# Monitoring script for Avocado.ai website
echo "=== Avocado.ai Website Status ==="
echo "Date: $(date)"
echo

# Check if containers are running
echo "Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep avocado

echo

# Check disk usage
echo "Disk Usage:"
df -h /opt

echo

# Check memory usage
echo "Memory Usage:"
free -h

echo

# Check application logs
echo "Recent Application Logs:"
docker logs --tail 10 avocado_backend 2>/dev/null || echo "Backend container not found"
echo
docker logs --tail 10 avocado_frontend 2>/dev/null || echo "Frontend container not found"
EOF

chmod +x monitor.sh

# Create SSL certificate setup script
print_status "Creating SSL setup script..."
cat > setup-ssl.sh << 'EOF'
#!/bin/bash

# SSL Certificate Setup Script
DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "Usage: $0 <your-domain.com>"
    exit 1
fi

# Install Certbot
sudo apt install -y certbot

# Get SSL certificate
sudo certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN

# Copy certificates to nginx directory
sudo mkdir -p /opt/avocado-ai/ssl
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem /opt/avocado-ai/ssl/cert.pem
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem /opt/avocado-ai/ssl/key.pem

# Update nginx configuration
sudo sed -i "s/your-domain.com/$DOMAIN/g" /opt/avocado-ai/nginx.conf
sudo sed -i "s/# ssl_certificate/ssl_certificate/g" /opt/avocado-ai/nginx.conf
sudo sed -i "s/# ssl_certificate_key/ssl_certificate_key/g" /opt/avocado-ai/nginx.conf

# Restart services
sudo systemctl restart avocado-ai.service

echo "SSL certificate setup completed for $DOMAIN"
EOF

chmod +x setup-ssl.sh

# Create update script
print_status "Creating update script..."
cat > update.sh << 'EOF'
#!/bin/bash

# Update script for Avocado.ai website
cd /opt/avocado-ai

# Pull latest changes
git pull origin main

# Rebuild and restart containers
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

echo "Website updated successfully!"
EOF

chmod +x update.sh

print_success "Deployment setup completed!"
echo
echo "📋 Next Steps:"
echo "1. Update the domain name in nginx.conf and .env files"
echo "2. Run: sudo systemctl start avocado-ai.service"
echo "3. For SSL: ./setup-ssl.sh your-domain.com"
echo "4. Monitor: ./monitor.sh"
echo "5. Update: ./update.sh"
echo
echo "🌐 Your website will be available at:"
echo "   - HTTP: http://your-domain.com"
echo "   - HTTPS: https://your-domain.com (after SSL setup)"
echo "   - Admin: https://your-domain.com/admin"
echo
print_warning "Remember to change default passwords in production!" 