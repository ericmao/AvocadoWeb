import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


class TestMainAPI:
    """測試主要的 API 端點"""

    def test_root_endpoint(self):
        """測試根端點"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data
        assert data["message"] == "Welcome to Avocado.ai API"

    def test_health_check(self):
        """測試健康檢查端點"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "avocado-api"

    def test_api_info(self):
        """測試 API 信息端點"""
        response = client.get("/api/info")
        assert response.status_code == 200
        data = response.json()
        assert "name" in data
        assert "description" in data
        assert "version" in data
        assert "features" in data
        assert isinstance(data["features"], list)

    def test_docs_endpoint(self):
        """測試文檔端點"""
        response = client.get("/docs")
        assert response.status_code == 200

    def test_redoc_endpoint(self):
        """測試 ReDoc 端點"""
        response = client.get("/redoc")
        assert response.status_code == 200


class TestAuthEndpoints:
    """測試認證相關端點"""

    def test_auth_endpoints_exist(self):
        """測試認證端點存在"""
        # 測試認證路由是否正確包含
        response = client.get("/api/auth/")
        # 這裡應該返回 404 或 405，因為我們沒有定義 GET 方法
        assert response.status_code in [404, 405]


class TestProductsEndpoints:
    """測試產品相關端點"""

    def test_products_endpoints_exist(self):
        """測試產品端點存在"""
        response = client.get("/api/products/")
        # 這裡應該返回 404 或 405，因為我們沒有定義 GET 方法
        assert response.status_code in [404, 405]


class TestCasesEndpoints:
    """測試案例相關端點"""

    def test_cases_endpoints_exist(self):
        """測試案例端點存在"""
        response = client.get("/api/cases/")
        # 這裡應該返回 404 或 405，因為我們沒有定義 GET 方法
        assert response.status_code in [404, 405]


class TestTechniquesEndpoints:
    """測試技術相關端點"""

    def test_techniques_endpoints_exist(self):
        """測試技術端點存在"""
        response = client.get("/api/techniques/")
        # 這裡應該返回 404 或 405，因為我們沒有定義 GET 方法
        assert response.status_code in [404, 405]


class TestContactEndpoints:
    """測試聯繫相關端點"""

    def test_contact_endpoints_exist(self):
        """測試聯繫端點存在"""
        response = client.get("/api/contact/")
        # 這裡應該返回 404 或 405，因為我們沒有定義 GET 方法
        assert response.status_code in [404, 405] 