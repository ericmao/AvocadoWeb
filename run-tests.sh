#!/bin/bash

# 測試運行腳本
echo "🧪 開始運行測試..."

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 函數：打印帶顏色的消息
print_status() {
    echo -e "${YELLOW}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 檢查是否在正確的目錄
if [ ! -f "docker-compose.yml" ]; then
    print_error "請在項目根目錄運行此腳本"
    exit 1
fi

# 後端測試
print_status "運行後端測試..."
cd backend
if pip install -r requirements.txt > /dev/null 2>&1; then
    if python -m pytest tests/ -v --tb=short; then
        print_success "後端測試通過"
    else
        print_error "後端測試失敗"
        cd ..
        exit 1
    fi
else
    print_error "後端依賴安裝失敗"
    cd ..
    exit 1
fi
cd ..

# 前端測試
print_status "運行前端測試..."
cd frontend
if npm install > /dev/null 2>&1; then
    if npm test -- --coverage --watchAll=false; then
        print_success "前端測試通過"
    else
        print_error "前端測試失敗"
        cd ..
        exit 1
    fi
else
    print_error "前端依賴安裝失敗"
    cd ..
    exit 1
fi
cd ..

# 代碼質量檢查
print_status "運行代碼質量檢查..."

# 後端代碼質量
cd backend
if command -v flake8 > /dev/null 2>&1; then
    if flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics; then
        print_success "後端代碼質量檢查通過"
    else
        print_error "後端代碼質量檢查失敗"
        cd ..
        exit 1
    fi
else
    print_status "flake8 未安裝，跳過後端代碼質量檢查"
fi
cd ..

# 前端代碼質量
cd frontend
if npm run lint; then
    print_success "前端代碼質量檢查通過"
else
    print_error "前端代碼質量檢查失敗"
    cd ..
    exit 1
fi
cd ..

print_success "所有測試完成！"
echo
echo "📊 測試摘要："
echo "  - 後端測試: ✅"
echo "  - 前端測試: ✅"
echo "  - 代碼質量: ✅"
echo
echo "🚀 準備部署！" 