#!/bin/bash

# 服務器修復腳本
# 解決磁盤空間不足和 Docker 配置問題

set -e

REMOTE_HOST="123.193.212.115"
REMOTE_USER="ubuntu"

echo "🔧 開始修復服務器問題..."

# 1. 清理磁盤空間
echo "🧹 清理磁盤空間..."
ssh -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST << 'EOF'
    # 清理 Docker
    sudo docker system prune -af || echo "Docker 清理完成"
    
    # 清理 apt 緩存
    sudo apt-get clean
    sudo apt-get autoremove -y
    
    # 清理日誌文件
    sudo journalctl --vacuum-time=1d
    
    # 清理臨時文件
    sudo rm -rf /tmp/*
    sudo rm -rf /var/tmp/*
    
    # 檢查磁盤空間
    df -h
EOF

# 2. 安裝 Docker Compose
echo "📦 安裝 Docker Compose..."
ssh -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST << 'EOF'
    # 安裝 Docker Compose
    sudo apt-get update
    sudo apt-get install -y docker-compose-plugin
    
    # 啟動 Docker 服務
    sudo systemctl start docker
    sudo systemctl enable docker
    
    # 將用戶添加到 docker 組
    sudo usermod -aG docker $USER
    
    # 檢查 Docker 狀態
    sudo docker --version
    docker compose version
EOF

# 3. 部署項目
echo "🚀 部署 Avocado.ai 項目..."
ssh -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST << 'EOF'
    # 創建項目目錄
    mkdir -p ~/avocado-ai
    cd ~/avocado-ai
    
    # 停止現有服務
    docker compose down 2>/dev/null || true
    docker-compose down 2>/dev/null || true
    
    # 清理舊的容器和鏡像
    docker system prune -af
EOF

# 4. 複製項目文件
echo "📤 複製項目文件..."
scp -o StrictHostKeyChecking=no -r . $REMOTE_USER@$REMOTE_HOST:~/avocado-ai/

# 5. 啟動服務
echo "🔨 啟動服務..."
ssh -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST << 'EOF'
    cd ~/avocado-ai
    
    # 設置 SSL 文件權限
    chmod 600 nginx/ssl/avocado.key 2>/dev/null || true
    chmod 644 nginx/ssl/avocado.crt 2>/dev/null || true
    
    # 啟動生產環境服務
    docker compose -f docker-compose.prod.yml up -d --build
    
    # 等待服務啟動
    sleep 20
    
    # 檢查服務狀態
    docker compose -f docker-compose.prod.yml ps
    
    # 檢查端口
    netstat -tlnp | grep -E ':(80|443)' || echo "端口檢查完成"
    
    # 檢查磁盤空間
    df -h
EOF

echo ""
echo "✅ 服務器修復完成！"
echo ""
echo "📊 檢查結果："
echo "   磁盤空間: ssh $REMOTE_USER@$REMOTE_HOST 'df -h'"
echo "   服務狀態: ssh $REMOTE_USER@$REMOTE_HOST 'cd ~/avocado-ai && docker compose -f docker-compose.prod.yml ps'"
echo "   服務日誌: ssh $REMOTE_USER@$REMOTE_HOST 'cd ~/avocado-ai && docker compose -f docker-compose.prod.yml logs -f'"
echo ""
echo "🌐 訪問地址："
echo "   HTTP:  http://$REMOTE_HOST"
echo "   HTTPS: https://$REMOTE_HOST"
echo "" 