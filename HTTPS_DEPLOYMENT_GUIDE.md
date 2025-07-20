# Avocado.ai HTTPS 部署指南

## 🔒 SSL 憑證配置

本項目已配置正式的 SSL 憑證，支持 HTTPS 加密連接。

### 📁 SSL 文件位置

```
nginx/ssl/
├── avocado.crt    # SSL 憑證
└── avocado.key    # 私鑰
```

### 🔐 憑證信息

- **頒發者**: Cloudflare Managed CA
- **有效期**: 2025-07-20 到 2035-07-18
- **域名**: avocado.ai, www.avocado.ai
- **加密算法**: RSA 2048-bit

## 🚀 本地 HTTPS 部署

### 1. 檢查必要文件

```bash
# 檢查 SSL 文件是否存在
ls -la nginx/ssl/
```

### 2. 設置文件權限

```bash
# 設置私鑰權限（僅所有者可讀）
chmod 600 nginx/ssl/avocado.key

# 設置憑證權限
chmod 644 nginx/ssl/avocado.crt
```

### 3. 啟動 HTTPS 服務

```bash
# 使用自動部署腳本
./deploy-https.sh

# 或手動部署
docker-compose -f docker-compose.prod.yml up -d --build
```

### 4. 驗證部署

```bash
# 檢查服務狀態
docker-compose -f docker-compose.prod.yml ps

# 測試 HTTP 重定向
curl -I http://localhost

# 測試 HTTPS 連接
curl -I https://localhost
```

## 🌐 遠程 HTTPS 部署

### 1. 準備遠程服務器

確保遠程 Ubuntu 服務器已安裝：
- Docker
- Docker Compose
- 開放端口 80 和 443

### 2. 執行遠程部署

```bash
# 使用自動遠程部署腳本
./deploy-https-remote.sh

# 或手動部署
ssh ubuntu@123.193.212.115
cd ~/avocado-ai
docker-compose -f docker-compose.prod.yml up -d --build
```

### 3. 驗證遠程部署

```bash
# 測試 HTTP 重定向
curl -I http://123.193.212.115

# 測試 HTTPS 連接
curl -I https://123.193.212.115
```

## 📊 服務架構

```
Internet
    ↓
Nginx (Port 80/443)
    ↓
├── Frontend (Port 3000)
├── Backend API (Port 8000)
└── Database (PostgreSQL)
```

### 🔄 流量流程

1. **HTTP 請求** → Nginx → 重定向到 HTTPS
2. **HTTPS 請求** → Nginx → 路由到相應服務
3. **靜態文件** → 前端服務
4. **API 請求** → 後端服務

## 🔧 管理命令

### 本地管理

```bash
# 啟動服務
docker-compose -f docker-compose.prod.yml up -d

# 停止服務
docker-compose -f docker-compose.prod.yml down

# 重啟服務
docker-compose -f docker-compose.prod.yml restart

# 查看日誌
docker-compose -f docker-compose.prod.yml logs -f

# 查看特定服務日誌
docker-compose -f docker-compose.prod.yml logs nginx
docker-compose -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.prod.yml logs backend
```

### 遠程管理

```bash
# SSH 登入
ssh ubuntu@123.193.212.115

# 進入項目目錄
cd ~/avocado-ai

# 執行管理命令
docker-compose -f docker-compose.prod.yml [command]
```

## 🔍 故障排除

### 常見問題

#### 1. SSL 憑證錯誤

```bash
# 檢查憑證文件
ls -la nginx/ssl/

# 檢查憑證內容
openssl x509 -in nginx/ssl/avocado.crt -text -noout

# 檢查私鑰
openssl rsa -in nginx/ssl/avocado.key -check
```

#### 2. Nginx 啟動失敗

```bash
# 檢查 Nginx 配置
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# 查看 Nginx 日誌
docker-compose -f docker-compose.prod.yml logs nginx
```

#### 3. 端口被佔用

```bash
# 檢查端口使用情況
netstat -tlnp | grep -E ':(80|443)'

# 停止佔用端口的服務
sudo lsof -ti:80 | xargs kill -9
sudo lsof -ti:443 | xargs kill -9
```

#### 4. 防火牆問題

```bash
# 檢查防火牆狀態
sudo ufw status

# 開放必要端口
sudo ufw allow 80
sudo ufw allow 443
```

### 日誌分析

```bash
# 查看所有服務日誌
docker-compose -f docker-compose.prod.yml logs

# 實時監控日誌
docker-compose -f docker-compose.prod.yml logs -f

# 查看特定時間的日誌
docker-compose -f docker-compose.prod.yml logs --since="2024-01-01T00:00:00"
```

## 🔒 安全配置

### SSL 安全設置

- **協議**: TLSv1.2, TLSv1.3
- **加密套件**: ECDHE-RSA-AES128-GCM-SHA256, ECDHE-RSA-AES256-GCM-SHA384
- **HSTS**: 啟用，有效期 1 年
- **安全標頭**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection

### 防火牆配置

```bash
# 開放必要端口
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 限制 SSH 訪問
sudo ufw allow from your-ip to any port 22
```

## 📈 性能優化

### Nginx 優化

- **Gzip 壓縮**: 啟用
- **靜態文件緩存**: 1 年
- **連接池**: 1024 連接
- **Keep-alive**: 65 秒

### Docker 優化

- **多階段構建**: 減少鏡像大小
- **非 root 用戶**: 提高安全性
- **健康檢查**: 自動監控服務狀態

## 🔄 更新部署

### 1. 更新代碼

```bash
# 拉取最新代碼
git pull origin main

# 重新構建和部署
docker-compose -f docker-compose.prod.yml up -d --build
```

### 2. 更新 SSL 憑證

```bash
# 備份舊憑證
cp nginx/ssl/avocado.crt nginx/ssl/avocado.crt.backup
cp nginx/ssl/avocado.key nginx/ssl/avocado.key.backup

# 更新憑證文件
# 將新的憑證和私鑰複製到 nginx/ssl/ 目錄

# 重啟 Nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

## 📞 支持

如果遇到問題，請檢查：

1. **日誌文件**: 查看詳細錯誤信息
2. **網絡連接**: 確保端口可訪問
3. **SSL 憑證**: 驗證憑證有效性
4. **系統資源**: 檢查 CPU 和內存使用

---

**注意**: 請確保 SSL 憑證文件的安全性和正確性，避免泄露私鑰。 