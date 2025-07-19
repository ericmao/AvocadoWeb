#!/bin/bash

# Docker Compose 快速修復腳本
# 修復 Ubuntu 伺服器上的 Docker Compose 問題

set -e

echo "🔧 開始修復 Docker Compose 問題..."

# 顏色定義
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

# 檢查是否為 root 用戶
if [[ $EUID -eq 0 ]]; then
   print_error "此腳本不應該以 root 身份運行"
   exit 1
fi

print_status "檢查當前 Docker 安裝狀態..."

# 檢查 Docker 是否已安裝
if ! command -v docker &> /dev/null; then
    print_error "Docker 未安裝，請先安裝 Docker"
    exit 1
fi

print_success "Docker 已安裝: $(docker --version)"

# 檢查 Docker Compose 是否已安裝
if ! docker compose version &> /dev/null; then
    print_warning "Docker Compose 未安裝或無法使用"
    
    print_status "重新安裝 Docker Compose..."
    
    # 移除舊的 docker-compose（如果存在）
    sudo apt remove docker-compose -y 2>/dev/null || true
    
    # 確保 Docker 已正確安裝
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # 驗證安裝
    if docker compose version &> /dev/null; then
        print_success "Docker Compose 安裝成功: $(docker compose version)"
    else
        print_error "Docker Compose 安裝失敗"
        exit 1
    fi
else
    print_success "Docker Compose 已安裝: $(docker compose version)"
fi

# 確保用戶在 docker 群組中
print_status "檢查 Docker 群組權限..."
if ! groups $USER | grep -q docker; then
    print_status "將用戶添加到 docker 群組..."
    sudo usermod -aG docker $USER
    print_warning "請重新登入以應用群組變更，或執行: newgrp docker"
else
    print_success "用戶已在 docker 群組中"
fi

# 檢查應用程式目錄
print_status "檢查應用程式目錄..."
if [ ! -d "/opt/avocado-ai" ]; then
    print_error "應用程式目錄不存在，請先完成部署"
    exit 1
fi

# 修正目錄權限
print_status "修正目錄權限..."
sudo chown -R $USER:$USER /opt/avocado-ai
sudo chmod -R 755 /opt/avocado-ai
print_success "目錄權限已修正"

# 更新 systemd 服務文件
print_status "更新 systemd 服務文件..."
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

print_success "服務文件已更新"

# 重新載入 systemd 配置
print_status "重新載入 systemd 配置..."
sudo systemctl daemon-reload

# 重啟服務
print_status "重啟 avocado-ai 服務..."
sudo systemctl restart avocado-ai.service

# 等待服務啟動
print_status "等待服務啟動..."
sleep 10

# 檢查服務狀態
print_status "檢查服務狀態..."
if sudo systemctl is-active --quiet avocado-ai.service; then
    print_success "服務已成功啟動"
else
    print_warning "服務啟動可能有問題，檢查狀態..."
    sudo systemctl status avocado-ai.service --no-pager -l
fi

# 檢查容器狀態
print_status "檢查容器狀態..."
if docker ps | grep -q avocado; then
    print_success "容器正在運行"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep avocado
else
    print_warning "沒有找到 avocado 容器，嘗試手動啟動..."
    
    # 進入應用程式目錄並手動啟動
    cd /opt/avocado-ai
    if docker compose -f docker-compose.prod.yml up -d; then
        print_success "容器手動啟動成功"
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep avocado
    else
        print_error "容器啟動失敗"
        print_status "檢查錯誤日誌..."
        docker compose -f docker-compose.prod.yml logs
    fi
fi

# 測試網站訪問
print_status "測試網站訪問..."
if curl -s -f http://localhost > /dev/null; then
    print_success "網站可以訪問"
else
    print_warning "網站可能還在啟動中，請稍後再試"
fi

print_success "修復完成！"
echo
echo "📊 檢查命令："
echo "   - 服務狀態: sudo systemctl status avocado-ai.service"
echo "   - 容器狀態: docker ps"
echo "   - 網站訪問: curl http://localhost"
echo "   - 查看日誌: docker logs avocado_backend"
echo
echo "🌐 網站地址："
echo "   - 主網站: http://123.193.212.115"
echo "   - 後台管理: http://123.193.212.115/admin"
echo
print_warning "如果仍有問題，請檢查："
echo "   - 防火牆設置: sudo ufw status"
echo "   - 端口監聽: sudo netstat -tulpn | grep :80"
echo "   - 系統日誌: sudo journalctl -u avocado-ai.service -f" 