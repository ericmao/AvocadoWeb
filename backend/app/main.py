from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
from database import SessionLocal, engine
from datetime import datetime

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Avocado.ai API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to Avocado.ai API"}

# Authentication endpoints
@app.post("/api/auth/login")
def login(credentials: schemas.LoginCredentials, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == credentials.username).first()
    if not user or not user.verify_password(credentials.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": "fake_token", "token_type": "bearer"}

# Contact endpoints
@app.post("/api/contact", response_model=schemas.Contact)
def create_contact(contact: schemas.ContactCreate, db: Session = Depends(get_db)):
    db_contact = models.Contact(**contact.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

@app.get("/api/contacts", response_model=List[schemas.Contact])
def get_contacts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    contacts = db.query(models.Contact).offset(skip).limit(limit).all()
    return contacts

# Job endpoints
@app.get("/api/jobs", response_model=List[schemas.Job])
def get_jobs(db: Session = Depends(get_db)):
    jobs = db.query(models.Job).filter(models.Job.is_active == True).all()
    return jobs

@app.post("/api/jobs", response_model=schemas.Job)
def create_job(job: schemas.JobCreate, db: Session = Depends(get_db)):
    db_job = models.Job(**job.dict())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@app.get("/api/jobs/{job_id}", response_model=schemas.Job)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@app.put("/api/jobs/{job_id}", response_model=schemas.Job)
def update_job(job_id: int, job: schemas.JobUpdate, db: Session = Depends(get_db)):
    db_job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    for field, value in job.dict(exclude_unset=True).items():
        setattr(db_job, field, value)
    
    db_job.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_job)
    return db_job

@app.delete("/api/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db.delete(job)
    db.commit()
    return {"message": "Job deleted successfully"}

# News endpoints
@app.get("/api/news", response_model=List[schemas.News])
def get_news(db: Session = Depends(get_db)):
    news = db.query(models.News).filter(models.News.is_published == True).all()
    return news

@app.post("/api/news", response_model=schemas.News)
def create_news(news: schemas.NewsCreate, db: Session = Depends(get_db)):
    db_news = models.News(**news.dict())
    db.add(db_news)
    db.commit()
    db.refresh(db_news)
    return db_news

@app.get("/api/news/{news_id}", response_model=schemas.News)
def get_news_item(news_id: int, db: Session = Depends(get_db)):
    news = db.query(models.News).filter(models.News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    return news

@app.put("/api/news/{news_id}", response_model=schemas.News)
def update_news(news_id: int, news: schemas.NewsUpdate, db: Session = Depends(get_db)):
    db_news = db.query(models.News).filter(models.News.id == news_id).first()
    if not db_news:
        raise HTTPException(status_code=404, detail="News not found")
    
    for field, value in news.dict(exclude_unset=True).items():
        setattr(db_news, field, value)
    
    db_news.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_news)
    return db_news

@app.delete("/api/news/{news_id}")
def delete_news(news_id: int, db: Session = Depends(get_db)):
    news = db.query(models.News).filter(models.News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    
    db.delete(news)
    db.commit()
    return {"message": "News deleted successfully"}

# Case endpoints
@app.get("/api/cases", response_model=List[schemas.Case])
def get_cases(db: Session = Depends(get_db)):
    cases = db.query(models.Case).filter(models.Case.is_active == True).all()
    return cases

@app.post("/api/cases", response_model=schemas.Case)
def create_case(case: schemas.CaseCreate, db: Session = Depends(get_db)):
    db_case = models.Case(**case.dict())
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return db_case

@app.get("/api/cases/{case_id}", response_model=schemas.Case)
def get_case(case_id: int, db: Session = Depends(get_db)):
    case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@app.put("/api/cases/{case_id}", response_model=schemas.Case)
def update_case(case_id: int, case: schemas.CaseUpdate, db: Session = Depends(get_db)):
    db_case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    for field, value in case.dict(exclude_unset=True).items():
        setattr(db_case, field, value)
    
    db_case.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_case)
    return db_case

@app.delete("/api/cases/{case_id}")
def delete_case(case_id: int, db: Session = Depends(get_db)):
    case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    db.delete(case)
    db.commit()
    return {"message": "Case deleted successfully"}

# Product endpoints
@app.get("/api/products", response_model=List[schemas.Product])
def get_products(db: Session = Depends(get_db)):
    products = db.query(models.Product).filter(models.Product.is_active == True).all()
    return products

@app.post("/api/products", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get("/api/products/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.put("/api/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for field, value in product.dict(exclude_unset=True).items():
        setattr(db_product, field, value)
    
    db_product.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_product)
    return db_product

@app.delete("/api/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"} 