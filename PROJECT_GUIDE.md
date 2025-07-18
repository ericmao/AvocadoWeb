# Avocado.ai Portal - 完整項目指南

## 🎯 項目概述

這是一個完整的 Avocado.ai 門戶網站，結合了前端 Next.js 和後端 FastAPI，為網絡安全和 AI 公司提供現代化的數字展示平台。

## 🏗️ 技術架構

### 前端 (Frontend)
- **框架**: Next.js 14 (React 18)
- **樣式**: Tailwind CSS
- **動畫**: Framer Motion
- **圖標**: Lucide React
- **語言**: TypeScript

### 後端 (Backend)
- **框架**: FastAPI (Python 3.11+)
- **數據庫**: PostgreSQL
- **ORM**: SQLAlchemy
- **認證**: JWT
- **驗證**: Pydantic

### 基礎設施
- **容器化**: Docker & Docker Compose
- **數據庫**: PostgreSQL 15
- **開發環境**: 熱重載支持

## 📁 項目結構

```
avocado-portal/
├── frontend/                 # Next.js 前端應用
│   ├── app/                 # App Router 頁面
│   │   ├── page.tsx        # 首頁
│   │   ├── techniques/     # 技術頁面
│   │   ├── products/       # 產品頁面
│   │   ├── cases/          # 案例頁面
│   │   └── contact/        # 聯繫頁面
│   ├── components/         # React 組件
│   │   ├── Navbar.tsx     # 導航欄
│   │   └── Footer.tsx     # 頁腳
│   ├── package.json        # 依賴配置
│   └── Dockerfile.dev      # 開發環境 Docker
├── backend/                # FastAPI 後端應用
│   ├── app/               # 應用代碼
│   │   ├── models.py      # 數據庫模型
│   │   ├── schemas.py     # Pydantic 模式
│   │   ├── database.py    # 數據庫配置
│   │   └── routers/       # API 路由
│   ├── main.py           # 主應用文件
│   ├── requirements.txt   # Python 依賴
│   └── Dockerfile.dev    # 開發環境 Docker
├── docker-compose.yml     # 容器編排
├── start.sh              # 啟動腳本
└── README.md             # 項目說明
```

## 🚀 快速開始

### 前置要求
- Docker & Docker Compose
- Git

### 啟動步驟

1. **克隆項目**
   ```bash
   git clone <repository-url>
   cd avocado-portal
   ```

2. **啟動服務**
   ```bash
   ./start.sh
   ```
   或者手動啟動：
   ```bash
   docker-compose up --build -d
   ```

3. **訪問應用**
   - 前端: http://localhost:3000
   - 後端 API: http://localhost:8000
   - API 文檔: http://localhost:8000/docs

## 📋 功能特性

### 前端功能
- ✅ 響應式設計
- ✅ 現代化 UI/UX
- ✅ 動畫效果
- ✅ SEO 優化
- ✅ 表單處理
- ✅ 路由管理

### 後端功能
- ✅ RESTful API
- ✅ JWT 認證
- ✅ 數據庫 CRUD
- ✅ 數據驗證
- ✅ CORS 支持
- ✅ API 文檔

### 頁面結構
1. **首頁** - 公司介紹和主要功能展示
2. **技術頁面** - 展示技術能力和方法論
3. **產品頁面** - 產品和解決方案展示
4. **案例頁面** - 成功案例和客戶故事
5. **聯繫頁面** - 聯繫表單和公司信息

## 🔧 開發指南

### 前端開發

1. **進入前端目錄**
   ```bash
   cd frontend
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **啟動開發服務器**
   ```bash
   npm run dev
   ```

### 後端開發

1. **進入後端目錄**
   ```bash
   cd backend
   ```

2. **創建虛擬環境**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # 或 venv\Scripts\activate  # Windows
   ```

3. **安裝依賴**
   ```bash
   pip install -r requirements.txt
   ```

4. **啟動開發服務器**
   ```bash
   uvicorn main:app --reload
   ```

## 🗄️ 數據庫

### 模型結構
- **User** - 用戶管理
- **Product** - 產品信息
- **CaseStudy** - 案例研究
- **Technique** - 技術方法
- **Contact** - 聯繫表單

### 數據庫操作
```bash
# 進入後端容器
docker-compose exec backend bash

# 運行數據庫遷移
alembic upgrade head

# 創建超級用戶
python -c "from app.models import User; from app.database import SessionLocal; db = SessionLocal(); user = User(username='admin', email='admin@avocado.ai', hashed_password='hashed_password'); db.add(user); db.commit()"
```

## 🔐 認證系統

### JWT 配置
- 密鑰: `SECRET_KEY` 環境變量
- 算法: HS256
- 過期時間: 30 分鐘

### API 端點
- `POST /api/auth/register` - 用戶註冊
- `POST /api/auth/token` - 用戶登錄
- `GET /api/auth/me` - 獲取當前用戶

## 🎨 設計系統

### 顏色方案
- **Avocado Green**: `#3a9a3a` (主色)
- **Cyber Blue**: `#0ea5e9` (輔助色)
- **Gray Scale**: 用於文字和背景

### 組件庫
- 按鈕組件 (btn-primary, btn-secondary)
- 卡片組件 (card)
- 導航組件 (Navbar)
- 頁腳組件 (Footer)

## 📊 API 端點

### 產品 API
- `GET /api/products/` - 獲取所有產品
- `GET /api/products/{id}` - 獲取單個產品
- `POST /api/products/` - 創建產品
- `PUT /api/products/{id}` - 更新產品
- `DELETE /api/products/{id}` - 刪除產品

### 案例 API
- `GET /api/cases/` - 獲取所有案例
- `GET /api/cases/{id}` - 獲取單個案例
- `POST /api/cases/` - 創建案例
- `PUT /api/cases/{id}` - 更新案例
- `DELETE /api/cases/{id}` - 刪除案例

### 技術 API
- `GET /api/techniques/` - 獲取所有技術
- `GET /api/techniques/{id}` - 獲取單個技術
- `POST /api/techniques/` - 創建技術
- `PUT /api/techniques/{id}` - 更新技術
- `DELETE /api/techniques/{id}` - 刪除技術

### 聯繫 API
- `POST /api/contact/` - 提交聯繫表單
- `GET /api/contact/` - 獲取所有聯繫記錄
- `PUT /api/contact/{id}/process` - 標記為已處理

## 🚀 部署指南

### 生產環境部署

1. **環境變量配置**
   ```bash
   # 創建 .env 文件
   DATABASE_URL=postgresql://user:pass@host:port/db
   SECRET_KEY=your-secret-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

2. **構建生產鏡像**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

3. **啟動生產服務**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### 雲端部署
- **Vercel**: 前端部署
- **Railway/Heroku**: 後端部署
- **Supabase**: 數據庫服務

## 🧪 測試

### 前端測試
```bash
cd frontend
npm test
```

### 後端測試
```bash
cd backend
pytest
```

## 📈 性能優化

### 前端優化
- 圖片優化
- 代碼分割
- 靜態生成
- 緩存策略

### 後端優化
- 數據庫索引
- 查詢優化
- 緩存層
- 負載均衡

## 🔧 故障排除

### 常見問題

1. **端口衝突**
   ```bash
   # 檢查端口使用
   lsof -i :3000
   lsof -i :8000
   ```

2. **數據庫連接問題**
   ```bash
   # 檢查數據庫狀態
   docker-compose logs db
   ```

3. **依賴安裝問題**
   ```bash
   # 清理並重新安裝
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

## 📞 支持

如有問題或建議，請聯繫：
- Email: info@avocado.ai
- GitHub: [項目倉庫]

---

**© 2024 Avocado.ai - 網絡安全和 AI 解決方案** 