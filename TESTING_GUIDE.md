# 🧪 測試指南

本項目包含完整的自動化測試設置，使用 GitHub Actions 進行持續集成。

## 📋 測試架構

### 後端測試 (Python/FastAPI)
- **單元測試**: 使用 pytest 測試 API 端點和業務邏輯
- **整合測試**: 測試數據庫連接和完整工作流程
- **代碼質量**: 使用 flake8、black、isort 進行代碼格式化檢查

### 前端測試 (Next.js/React)
- **組件測試**: 使用 Jest 和 React Testing Library 測試 React 組件
- **類型檢查**: TypeScript 編譯時類型檢查
- **代碼質量**: ESLint 進行代碼風格檢查

## 🚀 本地測試

### 後端測試

```bash
# 進入後端目錄
cd backend

# 安裝依賴
pip install -r requirements.txt

# 運行所有測試
python -m pytest tests/ -v

# 運行特定測試
python -m pytest tests/test_main.py -v

# 運行整合測試
python -m pytest tests/integration/ -v

# 生成覆蓋率報告
python -m pytest tests/ --cov=app --cov-report=html

# 代碼格式化檢查
flake8 .
black --check .
isort --check-only .
```

### 前端測試

```bash
# 進入前端目錄
cd frontend

# 安裝依賴
npm install

# 運行所有測試
npm test

# 運行測試並監視變化
npm run test:watch

# 生成覆蓋率報告
npm run test:coverage

# 類型檢查
npx tsc --noEmit

# 代碼風格檢查
npm run lint
```

## 🔧 GitHub Actions 工作流程

### 觸發條件
- 推送到 `main` 或 `develop` 分支
- 創建 Pull Request 到 `main` 或 `develop` 分支

### 測試階段

1. **後端測試** (`backend-tests`)
   - 設置 PostgreSQL 測試數據庫
   - 安裝 Python 依賴
   - 運行單元測試和整合測試
   - 執行代碼質量檢查

2. **前端測試** (`frontend-tests`)
   - 設置 Node.js 環境
   - 安裝 npm 依賴
   - 運行組件測試
   - 執行類型檢查和構建測試

3. **整合測試** (`integration-tests`)
   - 依賴於後端和前端測試成功
   - 測試完整的應用程序工作流程

## 📊 測試覆蓋率

### 後端覆蓋率
- 單元測試覆蓋率目標: 80%+
- 整合測試覆蓋率目標: 70%+
- 代碼質量檢查: 100% 通過

### 前端覆蓋率
- 組件測試覆蓋率目標: 70%+
- 類型檢查: 100% 通過
- 構建測試: 100% 通過

## 🐛 故障排除

### 常見問題

1. **測試數據庫連接失敗**
   ```bash
   # 檢查 PostgreSQL 服務
   sudo systemctl status postgresql
   
   # 手動創建測試數據庫
   sudo -u postgres createdb test_db
   ```

2. **前端測試依賴問題**
   ```bash
   # 清理 node_modules
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Python 依賴問題**
   ```bash
   # 清理 pip 緩存
   pip cache purge
   pip install -r requirements.txt --force-reinstall
   ```

### 調試技巧

1. **運行單個測試**
   ```bash
   # 後端
   python -m pytest tests/test_main.py::TestMainAPI::test_root_endpoint -v
   
   # 前端
   npm test -- --testNamePattern="Home Page"
   ```

2. **詳細輸出**
   ```bash
   # 後端
   python -m pytest tests/ -v -s
   
   # 前端
   npm test -- --verbose
   ```

## 📝 添加新測試

### 後端測試

1. 在 `backend/tests/` 目錄下創建新的測試文件
2. 使用 `Test` 前綴命名測試類
3. 使用 `test_` 前綴命名測試方法

```python
import pytest
from fastapi.testclient import TestClient

def test_new_feature():
    # 測試邏輯
    assert True
```

### 前端測試

1. 在 `frontend/__tests__/` 目錄下創建新的測試文件
2. 使用 `.test.tsx` 或 `.test.ts` 後綴
3. 使用 `describe` 和 `it` 組織測試

```typescript
import { render, screen } from '@testing-library/react'

describe('New Component', () => {
  it('should render correctly', () => {
    // 測試邏輯
    expect(true).toBe(true)
  })
})
```

## 🔄 持續集成

### 自動化流程

1. **代碼推送** → 觸發 GitHub Actions
2. **並行測試** → 後端和前端測試同時運行
3. **整合測試** → 所有單元測試通過後運行
4. **結果報告** → 在 GitHub 上顯示測試結果

### 測試狀態

- ✅ **成功**: 所有測試通過
- ❌ **失敗**: 測試失敗，需要修復
- ⚠️ **警告**: 代碼質量問題，但不影響功能

## 📈 性能優化

### 測試執行時間

- **後端測試**: ~2-3 分鐘
- **前端測試**: ~1-2 分鐘
- **整合測試**: ~1 分鐘
- **總計**: ~4-6 分鐘

### 優化建議

1. **並行執行**: 後端和前端測試並行運行
2. **緩存依賴**: 使用 GitHub Actions 緩存
3. **選擇性測試**: 只運行受影響的測試
4. **測試隔離**: 確保測試之間相互獨立

## 🎯 最佳實踐

1. **測試優先**: 新功能必須包含測試
2. **覆蓋率**: 保持高測試覆蓋率
3. **快速反饋**: 測試應該快速執行
4. **可讀性**: 測試代碼應該清晰易懂
5. **維護性**: 定期更新和重構測試

## 📞 支援

如果遇到測試問題：

1. 檢查 GitHub Actions 日誌
2. 在本地重現問題
3. 查看測試文檔
4. 聯繫開發團隊 