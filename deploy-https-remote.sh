#!/bin/bash

# Avocado.ai 遠程 HTTPS 部署腳本
# 部署到 Ubuntu 服務器並配置 HTTPS

set -e

# 配置
REMOTE_HOST="123.193.212.115"
REMOTE_USER="ubuntu"
REMOTE_PASS="ubuntu"
PROJECT_NAME="avocado-ai"

echo "🚀 開始遠程部署 Avocado.ai HTTPS 服務..."

# 檢查 SSH 連接
echo "🔌 檢查 SSH 連接..."
ssh -o ConnectTimeout=10 -o BatchMode=yes $REMOTE_USER@$REMOTE_HOST "echo 'SSH 連接成功'" || {
    echo "❌ SSH 連接失敗，請檢查網絡和憑證"
    exit 1
}

# 創建遠程目錄
echo "📁 創建遠程目錄..."
ssh $REMOTE_USER@$REMOTE_HOST "mkdir -p ~/$PROJECT_NAME"

# 複製項目文件
echo "📤 複製項目文件..."
scp -r . $REMOTE_USER@$REMOTE_HOST:~/$PROJECT_NAME/

# 在遠程服務器上執行部署
echo "🔨 在遠程服務器上執行部署..."
ssh $REMOTE_USER@$REMOTE_HOST << 'EOF'
    cd ~/avocado-ai
    
    # 設置 SSL 文件權限
    chmod 600 nginx/ssl/avocado.key
    chmod 644 nginx/ssl/avocado.crt
    
    # 停止現有服務
    docker-compose down 2>/dev/null || true
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
    
    # 構建和啟動服務
    docker-compose -f docker-compose.prod.yml up -d --build
    
    # 等待服務啟動
    sleep 15
    
    # 檢查服務狀態
    docker-compose -f docker-compose.prod.yml ps
    
    # 檢查端口
    netstat -tlnp | grep -E ':(80|443)' || echo "端口檢查完成"
    
    # 測試 HTTPS 連接
    if command -v curl >/dev/null 2>&1; then
        echo "測試 HTTP 重定向到 HTTPS..."
        curl -I http://localhost 2>/dev/null | head -1 || echo "HTTP 重定向測試完成"
        
        echo "測試 HTTPS 連接..."
        curl -I https://localhost 2>/dev/null | head -1 || echo "HTTPS 連接測試完成"
    else
        echo "⚠️  curl 未安裝，跳過連接測試"
    fi
EOF

echo ""
echo "✅ 遠程 HTTPS 部署完成！"
echo ""
echo "📊 服務信息："
echo "   🌐 HTTP:  http://$REMOTE_HOST (重定向到 HTTPS)"
echo "   🔒 HTTPS: https://$REMOTE_HOST"
echo ""
echo "🔧 遠程管理命令："
echo "   SSH 登入: ssh $REMOTE_USER@$REMOTE_HOST"
echo "   停止服務: ssh $REMOTE_USER@$REMOTE_HOST 'cd ~/avocado-ai && docker-compose -f docker-compose.prod.yml down'"
echo "   重啟服務: ssh $REMOTE_USER@$REMOTE_HOST 'cd ~/avocado-ai && docker-compose -f docker-compose.prod.yml restart'"
echo "   查看日誌: ssh $REMOTE_USER@$REMOTE_HOST 'cd ~/avocado-ai && docker-compose -f docker-compose.prod.yml logs -f'"
echo ""
echo "🔍 故障排除："
echo "   檢查 Nginx: ssh $REMOTE_USER@$REMOTE_HOST 'cd ~/avocado-ai && docker-compose -f docker-compose.prod.yml logs nginx'"
echo "   檢查前端: ssh $REMOTE_USER@$REMOTE_HOST 'cd ~/avocado-ai && docker-compose -f docker-compose.prod.yml logs frontend'"
echo "   檢查後端: ssh $REMOTE_USER@$REMOTE_HOST 'cd ~/avocado-ai && docker-compose -f docker-compose.prod.yml logs backend'"
echo "" 