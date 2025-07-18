from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json

from ..database import get_db
from ..models import Product
from ..schemas import Product as ProductSchema, ProductCreate

router = APIRouter()

@router.get("/", response_model=List[ProductSchema])
def get_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.is_active == True).offset(skip).limit(limit).all()
    return products

@router.get("/{product_id}", response_model=ProductSchema)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id, Product.is_active == True).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=ProductSchema)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(
        name=product.name,
        category=product.category,
        description=product.description,
        features=product.features,
        price=product.price
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.put("/{product_id}", response_model=ProductSchema)
def update_product(product_id: int, product: ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db_product.name = product.name
    db_product.category = product.category
    db_product.description = product.description
    db_product.features = product.features
    db_product.price = product.price
    
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db_product.is_active = False
    db.commit()
    return {"message": "Product deleted successfully"}

# Sample data endpoint
@router.get("/sample/data")
def get_sample_products():
    return [
        {
            "id": 1,
            "name": "Avocado Shield",
            "category": "Endpoint Protection",
            "description": "Advanced endpoint security that protects devices from sophisticated threats using AI-powered detection.",
            "features": json.dumps(["Real-time threat detection", "Behavioral analysis", "Automated response", "Cloud-based management"]),
            "price": "Starting at $25/user/month",
            "is_active": True
        },
        {
            "id": 2,
            "name": "Avocado AI Sentinel",
            "category": "AI Security Platform",
            "description": "Comprehensive AI-powered security platform that learns and adapts to new threats automatically.",
            "features": json.dumps(["Machine learning algorithms", "Predictive analytics", "Threat intelligence", "Automated incident response"]),
            "price": "Starting at $50/user/month",
            "is_active": True
        },
        {
            "id": 3,
            "name": "Avocado Response",
            "category": "Incident Response",
            "description": "Rapid incident response and recovery solution with automated workflows and AI assistance.",
            "features": json.dumps(["Automated workflows", "AI-powered analysis", "Real-time alerts", "Recovery automation"]),
            "price": "Starting at $100/incident",
            "is_active": True
        }
    ] 