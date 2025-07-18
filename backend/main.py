from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List
import os
from dotenv import load_dotenv

from app.database import engine, get_db
from app.models import Base
from app.routers import auth, products, cases, techniques, contact
from app.schemas import ContactCreate

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Avocado.ai API",
    description="Backend API for Avocado.ai cybersecurity and AI portal",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(cases.router, prefix="/api/cases", tags=["Cases"])
app.include_router(techniques.router, prefix="/api/techniques", tags=["Techniques"])
app.include_router(contact.router, prefix="/api/contact", tags=["Contact"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to Avocado.ai API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "avocado-api"}

@app.get("/api/info")
async def get_api_info():
    return {
        "name": "Avocado.ai API",
        "description": "Cybersecurity and AI company portal backend",
        "version": "1.0.0",
        "features": [
            "Authentication & Authorization",
            "Product Management",
            "Case Studies",
            "Techniques & Technologies",
            "Contact Form Processing"
        ]
    } 