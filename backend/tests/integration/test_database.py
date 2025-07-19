import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import get_db
from app.models import Base
import os

# 測試數據庫 URL
TEST_DATABASE_URL = "postgresql://test_user:test_password@localhost:5432/test_db"

@pytest.fixture(scope="function")
def test_db():
    """創建測試數據庫會話"""
    # 創建測試引擎
    engine = create_engine(TEST_DATABASE_URL)
    
    # 創建所有表
    Base.metadata.create_all(bind=engine)
    
    # 創建會話
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = TestingSessionLocal()
    
    try:
        yield db
    finally:
        db.close()
        # 清理表
        Base.metadata.drop_all(bind=engine)


class TestDatabaseConnection:
    """測試數據庫連接"""

    def test_database_connection(self, test_db):
        """測試數據庫連接是否正常"""
        # 執行簡單查詢
        result = test_db.execute("SELECT 1")
        assert result.scalar() == 1

    def test_database_tables_created(self, test_db):
        """測試數據庫表是否正確創建"""
        # 檢查表是否存在
        result = test_db.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = [row[0] for row in result.fetchall()]
        
        # 這裡應該包含我們應用程序的所有表
        # 根據實際的模型來調整
        assert len(tables) > 0


class TestDatabaseOperations:
    """測試數據庫操作"""

    def test_user_creation(self, test_db):
        """測試用戶創建"""
        # 這裡可以添加用戶創建測試
        # 需要根據實際的用戶模型來實現
        pass

    def test_product_creation(self, test_db):
        """測試產品創建"""
        # 這裡可以添加產品創建測試
        # 需要根據實際的產品模型來實現
        pass

    def test_case_creation(self, test_db):
        """測試案例創建"""
        # 這裡可以添加案例創建測試
        # 需要根據實際的案例模型來實現
        pass 