#!/bin/bash

# Avocado.ai HTTPS 部署腳本
# 使用正式的 SSL 憑證

set -e

echo "🚀 開始部署 Avocado.ai HTTPS 服務..."

# 檢查必要文件
echo "📋 檢查必要文件..."

if [ ! -f "nginx/ssl/avocado.crt" ]; then
    echo "❌ 錯誤: SSL 憑證文件不存在"
    exit 1
fi

if [ ! -f "nginx/ssl/avocado.key" ]; then
    echo "❌ 錯誤: SSL 私鑰文件不存在"
    exit 1
fi

# 設置權限
echo "🔐 設置 SSL 文件權限..."
chmod 600 nginx/ssl/avocado.key
chmod 644 nginx/ssl/avocado.crt

# 停止現有服務
echo "🛑 停止現有服務..."
docker-compose down 2>/dev/null || true

# 構建和啟動服務
echo "🔨 構建和啟動服務..."
docker-compose -f docker-compose.prod.yml up -d --build

# 等待服務啟動
echo "⏳ 等待服務啟動..."
sleep 10

# 檢查服務狀態
echo "🔍 檢查服務狀態..."
docker-compose -f docker-compose.prod.yml ps

# 檢查端口
echo "🌐 檢查端口監聽..."
netstat -tlnp | grep -E ':(80|443)' || echo "端口檢查完成"

# 測試 HTTPS 連接
echo "🔒 測試 HTTPS 連接..."
if command -v curl >/dev/null 2>&1; then
    echo "測試 HTTP 重定向到 HTTPS..."
    curl -I http://localhost 2>/dev/null | head -1 || echo "HTTP 重定向測試完成"
    
    echo "測試 HTTPS 連接..."
    curl -I https://localhost 2>/dev/null | head -1 || echo "HTTPS 連接測試完成"
else
    echo "⚠️  curl 未安裝，跳過連接測試"
fi

echo ""
echo "✅ Avocado.ai HTTPS 部署完成！"
echo ""
echo "📊 服務信息："
echo "   🌐 HTTP:  http://localhost (重定向到 HTTPS)"
echo "   🔒 HTTPS: https://localhost"
echo "   📝 日誌:  docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🔧 管理命令："
echo "   停止服務: docker-compose -f docker-compose.prod.yml down"
echo "   重啟服務: docker-compose -f docker-compose.prod.yml restart"
echo "   查看日誌: docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🔍 故障排除："
echo "   檢查 Nginx: docker-compose -f docker-compose.prod.yml logs nginx"
echo "   檢查前端: docker-compose -f docker-compose.prod.yml logs frontend"
echo "   檢查後端: docker-compose -f docker-compose.prod.yml logs backend"
echo "" 