#!/bin/bash

# Quick Deployment Script for Avocado.ai Website
# This is a simplified version for faster deployment

set -e

echo "🚀 Quick Deployment for Avocado.ai Website"

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

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo "❌ This script should not be run as root"
   exit 1
fi

# Get domain from user
read -p "Enter your domain (e.g., example.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo "❌ Domain is required"
    exit 1
fi

print_status "Starting deployment for domain: $DOMAIN"

# Update system
print_status "Updating system..."
sudo apt update && sudo apt upgrade -y

# Install Docker
print_status "Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER

# Install Node.js
print_status "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
print_status "Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Setup database
print_status "Setting up database..."
sudo -u postgres psql -c "CREATE DATABASE avocado_db;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE USER avocado_user WITH PASSWORD 'avocado_password';" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE avocado_db TO avocado_user;" 2>/dev/null || true

# Create application directory
print_status "Setting up application..."
sudo mkdir -p /opt/avocado-ai
sudo chown $USER:$USER /opt/avocado-ai

# Copy files
cp -r . /opt/avocado-ai/
cd /opt/avocado-ai

# Update domain in configuration
print_status "Updating domain configuration..."
sed -i "s/your-domain.com/$DOMAIN/g" nginx.conf
sed -i "s/your-domain.com/$DOMAIN/g" .env

# Create production compose file
cat > docker-compose.prod.yml << EOF
version: '3.8'

services:
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

# Create systemd service
print_status "Creating systemd service..."
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

# Enable and start service
sudo systemctl enable avocado-ai.service
sudo systemctl start avocado-ai.service

# Wait for services to start
print_status "Waiting for services to start..."
sleep 30

# Check if services are running
if docker ps | grep -q avocado; then
    print_success "Services started successfully!"
else
    print_warning "Some services may not have started. Check with: docker ps"
fi

# Setup SSL certificate
print_status "Setting up SSL certificate..."
sudo apt install -y certbot

# Create SSL setup script
cat > setup-ssl.sh << EOF
#!/bin/bash
DOMAIN=$DOMAIN

# Get SSL certificate
sudo certbot certonly --standalone -d \$DOMAIN -d www.\$DOMAIN

# Copy certificates
sudo mkdir -p /opt/avocado-ai/ssl
sudo cp /etc/letsencrypt/live/\$DOMAIN/fullchain.pem /opt/avocado-ai/ssl/cert.pem
sudo cp /etc/letsencrypt/live/\$DOMAIN/privkey.pem /opt/avocado-ai/ssl/key.pem

# Update nginx configuration
sudo sed -i "s/# ssl_certificate/ssl_certificate/g" /opt/avocado-ai/nginx.conf
sudo sed -i "s/# ssl_certificate_key/ssl_certificate_key/g" /opt/avocado-ai/nginx.conf

# Restart services
sudo systemctl restart avocado-ai.service

echo "SSL certificate setup completed for \$DOMAIN"
EOF

chmod +x setup-ssl.sh

# Setup firewall
print_status "Setting up firewall..."
sudo apt install -y ufw
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

print_success "Quick deployment completed!"
echo
echo "📋 Next Steps:"
echo "1. Wait a few minutes for all services to start"
echo "2. Setup SSL: ./setup-ssl.sh"
echo "3. Access your website: http://$DOMAIN"
echo "4. Access admin panel: http://$DOMAIN/admin"
echo
echo "🔐 Default credentials:"
echo "   - Admin: admin / admin"
echo "   - Database: avocado_user / avocado_password"
echo
print_warning "Remember to change default passwords!"
echo
echo "📊 Monitor your services:"
echo "   - Check status: sudo systemctl status avocado-ai.service"
echo "   - View logs: docker logs avocado_backend"
echo "   - Check containers: docker ps" 