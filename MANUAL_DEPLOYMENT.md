# 手動部署指南 - Ubuntu 24.04

## 🚀 在伺服器上直接執行

請在您的 Ubuntu 伺服器 (123.193.212.115) 上執行以下命令：

### 1. 連接到伺服器

```bash
ssh ubuntu@123.193.212.115
```

### 2. 更新系統

```bash
sudo apt update && sudo apt upgrade -y
```

### 3. 安裝 Docker

```bash
# 添加 Docker 官方 GPG 金鑰
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 添加 Docker 倉庫
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安裝 Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 將用戶添加到 docker 群組
sudo usermod -aG docker $USER
```

### 4. 安裝 Node.js

```bash
# 安裝 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### 5. 安裝 PostgreSQL

```bash
# 安裝 PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# 啟動並啟用服務
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 創建資料庫和用戶
sudo -u postgres psql -c "CREATE DATABASE avocado_db;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE USER avocado_user WITH PASSWORD 'avocado_password';" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE avocado_db TO avocado_user;" 2>/dev/null || true
```

### 6. 設置應用程式

```bash
# 創建應用程式目錄
sudo mkdir -p /opt/avocado-ai
sudo chown $USER:$USER /opt/avocado-ai

# 克隆倉庫
cd /opt
git clone https://github.com/ericmao/AvocadoWeb.git avocado-ai
cd avocado-ai
```

### 7. 創建環境配置

```bash
# 創建環境變數文件
cat > .env << 'EOF'
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
EOF
```

### 8. 創建 Docker Compose 配置

```bash
# 創建生產環境 Docker Compose 文件
cat > docker-compose.prod.yml << 'EOF'
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
EOF
```

### 9. 創建 Nginx 配置

```bash
# 創建 Nginx 配置文件
cat > nginx.conf << 'EOF'
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
EOF
```

### 10. 創建 Dockerfile 文件

```bash
# 創建後端 Dockerfile
cat > backend/Dockerfile << 'EOF'
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

# 創建前端 Dockerfile
cat > frontend/Dockerfile << 'EOF'
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
```

### 11. 創建系統服務

```bash
# 創建 systemd 服務文件
sudo tee /etc/systemd/system/avocado-ai.service > /dev/null << 'EOF'
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

# 啟用並啟動服務
sudo systemctl enable avocado-ai.service
sudo systemctl start avocado-ai.service
```

### 12. 設置防火牆

```bash
# 安裝並配置防火牆
sudo apt install -y ufw
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
```

### 13. 重新登入以應用 Docker 群組變更

```bash
# 登出並重新登入
exit
```

然後重新連接：
```bash
ssh ubuntu@123.193.212.115
```

### 14. 啟動應用程式

```bash
# 進入應用程式目錄
cd /opt/avocado-ai

# 啟動服務
sudo systemctl start avocado-ai.service

# 檢查狀態
sudo systemctl status avocado-ai.service
```

### 15. 檢查部署狀態

```bash
# 檢查容器狀態
docker ps

# 檢查服務日誌
docker logs avocado_backend
docker logs avocado_frontend
docker logs avocado_nginx

# 測試網站
curl http://123.193.212.115
```

## 🌐 訪問地址

部署完成後，您可以通過以下地址訪問：

- **主網站**：http://123.193.212.115
- **後台管理**：http://123.193.212.115/admin
- **API 文檔**：http://123.193.212.115/api

## 🔐 預設登入資訊

- **後台管理**：admin / admin
- **資料庫**：avocado_user / avocado_password

## 📊 管理命令

```bash
# 檢查服務狀態
sudo systemctl status avocado-ai.service

# 重啟服務
sudo systemctl restart avocado-ai.service

# 查看日誌
sudo journalctl -u avocado-ai.service -f

# 檢查容器
docker ps
docker logs avocado_backend
docker logs avocado_frontend

# 進入容器
docker exec -it avocado_backend bash
docker exec -it avocado_frontend sh
```

## 🔧 故障排除

### 如果網站無法訪問：

1. 檢查防火牆：
```bash
sudo ufw status
```

2. 檢查端口：
```bash
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
```

3. 檢查容器狀態：
```bash
docker ps -a
```

4. 重新啟動服務：
```bash
sudo systemctl restart avocado-ai.service
```

### 如果資料庫連接失敗：

```bash
# 檢查 PostgreSQL 狀態
sudo systemctl status postgresql

# 檢查資料庫連接
sudo -u postgres psql -c "\l"
```

## 🚨 重要提醒

1. **更改預設密碼**：請在生產環境中更改所有預設密碼
2. **定期備份**：設置定期備份資料庫和應用程式文件
3. **監控系統**：設置系統監控和日誌管理
4. **安全更新**：定期更新系統和應用程式

## 📞 支援

如果遇到問題，請檢查：

1. 系統日誌：`sudo journalctl -u avocado-ai.service`
2. Docker 日誌：`docker logs avocado_backend`
3. Nginx 日誌：`docker logs avocado_nginx` 