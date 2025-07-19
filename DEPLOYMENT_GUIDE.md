# Avocado.ai 網站部署指南 - Ubuntu 24.04

## 🚀 快速部署

### 1. 準備 Ubuntu 24.04 伺服器

```bash
# 更新系統
sudo apt update && sudo apt upgrade -y

# 安裝必要工具
sudo apt install -y curl wget git unzip
```

### 2. 下載並執行部署腳本

```bash
# 下載專案
git clone https://github.com/ericmao/AvocadoWeb.git
cd AvocadoWeb

# 執行部署腳本
chmod +x deploy.sh
./deploy.sh
```

### 3. 配置域名

編輯配置文件：
```bash
sudo nano /opt/avocado-ai/nginx.conf
sudo nano /opt/avocado-ai/.env
```

將 `your-domain.com` 替換為您的實際域名。

### 4. 啟動服務

```bash
# 啟動網站服務
sudo systemctl start avocado-ai.service

# 檢查狀態
sudo systemctl status avocado-ai.service
```

### 5. 設置 SSL 證書

```bash
cd /opt/avocado-ai
./setup-ssl.sh your-domain.com
```

## 📋 詳細步驟

### 系統要求

- Ubuntu 24.04 LTS
- 至少 2GB RAM
- 至少 20GB 硬碟空間
- 域名（用於 SSL 證書）

### 手動安裝步驟

#### 1. 安裝 Docker

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

#### 2. 安裝 Node.js

```bash
# 安裝 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

#### 3. 安裝 PostgreSQL

```bash
# 安裝 PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# 啟動並啟用服務
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 創建資料庫和用戶
sudo -u postgres psql -c "CREATE DATABASE avocado_db;"
sudo -u postgres psql -c "CREATE USER avocado_user WITH PASSWORD 'avocado_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE avocado_db TO avocado_user;"
```

#### 4. 部署應用程式

```bash
# 創建應用程式目錄
sudo mkdir -p /opt/avocado-ai
sudo chown $USER:$USER /opt/avocado-ai

# 複製檔案
cp -r . /opt/avocado-ai/
cd /opt/avocado-ai

# 啟動服務
sudo systemctl start avocado-ai.service
sudo systemctl enable avocado-ai.service
```

## 🔧 管理命令

### 檢查服務狀態

```bash
# 檢查容器狀態
docker ps

# 檢查服務日誌
docker logs avocado_backend
docker logs avocado_frontend
docker logs avocado_nginx
```

### 備份資料

```bash
cd /opt/avocado-ai
./backup.sh
```

### 監控系統

```bash
cd /opt/avocado-ai
./monitor.sh
```

### 更新網站

```bash
cd /opt/avocado-ai
./update.sh
```

### 重啟服務

```bash
sudo systemctl restart avocado-ai.service
```

## 🔒 安全配置

### 1. 更改預設密碼

```bash
# 更改資料庫密碼
sudo -u postgres psql -c "ALTER USER avocado_user WITH PASSWORD 'your-secure-password';"

# 更改管理員密碼
# 登入後台管理系統 /admin 並更改密碼
```

### 2. 防火牆配置

```bash
# 安裝 UFW
sudo apt install -y ufw

# 配置防火牆規則
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 3. 定期更新

```bash
# 系統更新
sudo apt update && sudo apt upgrade -y

# 網站更新
cd /opt/avocado-ai
./update.sh
```

## 📊 監控和維護

### 系統監控

```bash
# 檢查磁碟使用量
df -h

# 檢查記憶體使用量
free -h

# 檢查 CPU 使用量
top

# 檢查網路連接
netstat -tulpn
```

### 日誌管理

```bash
# 查看應用程式日誌
docker logs -f avocado_backend
docker logs -f avocado_frontend

# 查看系統日誌
sudo journalctl -u avocado-ai.service -f
```

## 🚨 故障排除

### 常見問題

1. **容器無法啟動**
   ```bash
   # 檢查 Docker 服務
   sudo systemctl status docker
   
   # 重新啟動 Docker
   sudo systemctl restart docker
   ```

2. **資料庫連接失敗**
   ```bash
   # 檢查 PostgreSQL 服務
   sudo systemctl status postgresql
   
   # 檢查資料庫連接
   sudo -u postgres psql -c "\l"
   ```

3. **SSL 證書問題**
   ```bash
   # 重新生成 SSL 證書
   ./setup-ssl.sh your-domain.com
   ```

4. **網站無法訪問**
   ```bash
   # 檢查防火牆
   sudo ufw status
   
   # 檢查端口
   sudo netstat -tulpn | grep :80
   sudo netstat -tulpn | grep :443
   ```

### 重置系統

```bash
# 停止所有服務
sudo systemctl stop avocado-ai.service

# 清理容器
docker-compose -f docker-compose.prod.yml down -v

# 重新部署
./deploy.sh
```

## 📞 支援

如果遇到問題，請檢查：

1. 系統日誌：`sudo journalctl -u avocado-ai.service`
2. Docker 日誌：`docker logs avocado_backend`
3. Nginx 日誌：`docker logs avocado_nginx`

## 🔄 自動化腳本

### 每日備份

創建 cron 任務：
```bash
# 編輯 crontab
crontab -e

# 添加每日備份任務
0 2 * * * /opt/avocado-ai/backup.sh
```

### 監控腳本

創建監控 cron 任務：
```bash
# 每小時檢查一次
0 * * * * /opt/avocado-ai/monitor.sh >> /var/log/avocado-monitor.log 2>&1
```

## 📈 效能優化

### 1. 資料庫優化

```sql
-- 在 PostgreSQL 中執行
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
```

### 2. Nginx 優化

```nginx
# 在 nginx.conf 中添加
worker_processes auto;
worker_connections 1024;
keepalive_timeout 65;
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### 3. 應用程式優化

```bash
# 增加 Node.js 記憶體限制
export NODE_OPTIONS="--max-old-space-size=2048"
```

## 🎯 完成檢查清單

- [ ] 系統更新完成
- [ ] Docker 安裝並運行
- [ ] PostgreSQL 安裝並配置
- [ ] 應用程式部署完成
- [ ] 域名配置正確
- [ ] SSL 證書安裝
- [ ] 防火牆配置
- [ ] 備份系統設置
- [ ] 監控系統設置
- [ ] 安全配置完成

## 🌐 訪問地址

部署完成後，您可以通過以下地址訪問：

- **主網站**：https://your-domain.com
- **後台管理**：https://your-domain.com/admin
- **API 文檔**：https://your-domain.com/docs

## 🔐 預設登入資訊

- **後台管理**：admin / admin
- **資料庫**：avocado_user / avocado_password

**⚠️ 重要提醒**：請在生產環境中更改所有預設密碼！ 