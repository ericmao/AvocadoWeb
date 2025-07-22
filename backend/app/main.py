from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, products, cases, techniques, contact, news, jobs

app = FastAPI(title="酪梨智慧 API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允許所有來源，用於開發環境
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(contact.router, prefix="/api/contact", tags=["Contact"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(news.router, prefix="/api/news", tags=["News"])
app.include_router(cases.router, prefix="/api/cases", tags=["Cases"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(techniques.router, prefix="/api/techniques", tags=["Techniques"])

@app.get("/")
def read_root():
    return {"message": "Welcome to 酪梨智慧 API"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "酪梨智慧 API is running"}

@app.get("/test/jobs")
def test_jobs():
    return {"message": "Jobs router is working", "sample_data": [
        {
            "id": 1,
            "title": "Senior AI Security Engineer",
            "department": "Engineering",
            "location": "Taiwan (台灣)",
            "type": "Full-time",
            "salary": "$120,000 - $180,000",
            "description": "Join our team to develop cutting-edge AI-powered security solutions.",
            "requirements": ["5+ years experience in cybersecurity", "Strong Python and machine learning skills"],
            "benefits": ["Competitive salary and equity", "Health, dental, and vision insurance"],
            "is_active": True
        }
    ]} 