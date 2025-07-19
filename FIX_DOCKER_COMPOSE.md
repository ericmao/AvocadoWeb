# Docker Compose 修復指南

## 🚨 問題診斷

錯誤顯示 `docker-compose` 命令無法執行，這通常是因為 Docker Compose 沒有正確安裝。

## 🔧 修復步驟

請在伺服器上執行以下命令：

### 1. 檢查 Docker 安裝狀態

```bash
# 檢查 Docker 是否已安裝
docker --version

# 檢查 Docker Compose 是否已安裝
docker compose version
```

### 2. 重新安裝 Docker Compose

```bash
# 移除舊的 docker-compose（如果存在）
sudo apt remove docker-compose -y

# 確保 Docker 已正確安裝
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 驗證安裝
docker compose version
```

### 3. 更新 systemd 服務文件

```bash
# 編輯服務文件
sudo nano /etc/systemd/system/avocado-ai.service
```

將內容替換為：

```ini
[Unit]
Description=Avocado.ai Website
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/avocado-ai
ExecStart=/usr/bin/docker compose -f docker-compose.prod.yml up -d
ExecStop=/usr/bin/docker compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

### 4. 重新載入並啟動服務

```bash
# 重新載入 systemd 配置
sudo systemctl daemon-reload

# 重啟服務
sudo systemctl restart avocado-ai.service

# 檢查狀態
sudo systemctl status avocado-ai.service
```

### 5. 如果問題持續，手動啟動

```bash
# 進入應用程式目錄
cd /opt/avocado-ai

# 手動啟動容器
docker compose -f docker-compose.prod.yml up -d

# 檢查容器狀態
docker ps
```

## 🔍 故障排除

### 如果 Docker Compose 仍然無法使用：

```bash
# 方法 1：使用 Docker Compose V2
docker compose version

# 方法 2：安裝獨立版本
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 驗證安裝
docker-compose --version
```

### 如果權限問題：

```bash
# 確保用戶在 docker 群組中
sudo usermod -aG docker $USER

# 重新登入或執行
newgrp docker

# 測試 Docker 權限
docker ps
```

### 如果目錄權限問題：

```bash
# 檢查目錄權限
ls -la /opt/avocado-ai

# 修正權限
sudo chown -R $USER:$USER /opt/avocado-ai
sudo chmod -R 755 /opt/avocado-ai
```

## 📊 驗證部署

### 1. 檢查所有服務

```bash
# 檢查容器狀態
docker ps

# 檢查服務日誌
docker logs avocado_backend
docker logs avocado_frontend
docker logs avocado_nginx
```

### 2. 測試網站訪問

```bash
# 測試本地訪問
curl http://localhost

# 測試 API
curl http://localhost/api

# 檢查端口
sudo netstat -tulpn | grep :80
```

### 3. 檢查防火牆

```bash
# 檢查防火牆狀態
sudo ufw status

# 確保端口開放
sudo ufw allow 80
sudo ufw allow 443
```

## 🚀 完整修復腳本

如果您想要一次性修復所有問題，可以執行以下腳本：

```bash
#!/bin/bash

echo "🔧 修復 Docker Compose 問題..."

# 更新系統
sudo apt update

# 重新安裝 Docker
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 確保用戶在 docker 群組中
sudo usermod -aG docker $USER

# 修正目錄權限
sudo chown -R $USER:$USER /opt/avocado-ai
sudo chmod -R 755 /opt/avocado-ai

# 更新服務文件
sudo tee /etc/systemd/system/avocado-ai.service > /dev/null << 'EOF'
[Unit]
Description=Avocado.ai Website
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/avocado-ai
ExecStart=/usr/bin/docker compose -f docker-compose.prod.yml up -d
ExecStop=/usr/bin/docker compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# 重新載入並啟動服務
sudo systemctl daemon-reload
sudo systemctl restart avocado-ai.service

echo "✅ 修復完成！"
echo "檢查狀態：sudo systemctl status avocado-ai.service"
```

## 📞 如果問題持續

如果以上步驟都無法解決問題，請檢查：

1. **系統日誌**：
   ```bash
   sudo journalctl -u avocado-ai.service -f
   ```

2. **Docker 日誌**：
   ```bash
   sudo journalctl -u docker.service -f
   ```

3. **手動測試**：
   ```bash
   cd /opt/avocado-ai
   docker compose -f docker-compose.prod.yml up -d
   ```

4. **檢查 Docker 服務**：
   ```bash
   sudo systemctl status docker
   ```

## 🎯 成功指標

修復成功後，您應該看到：

- ✅ `docker compose version` 顯示版本信息
- ✅ `sudo systemctl status avocado-ai.service` 顯示 "active"
- ✅ `docker ps` 顯示所有容器運行中
- ✅ 可以訪問 http://123.193.212.115 