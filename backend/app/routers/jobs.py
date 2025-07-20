from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json
from datetime import datetime

from ..database import get_db
from ..models import Job
from ..schemas import Job as JobSchema, JobCreate

router = APIRouter()

@router.get("/", response_model=List[JobSchema])
def get_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    jobs = db.query(Job).filter(Job.is_active == True).offset(skip).limit(limit).all()
    return jobs

@router.get("/tags", response_model=List[str])
def get_all_tags(db: Session = Depends(get_db)):
    """Get all unique tags from all jobs"""
    jobs = db.query(Job).filter(Job.is_active == True).all()
    all_tags = []
    for job in jobs:
        if job.tags:
            all_tags.extend(job.tags)
    return list(set(all_tags))  # Remove duplicates

@router.get("/{job_id}", response_model=JobSchema)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id, Job.is_active == True).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.post("/", response_model=JobSchema)
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    db_job = Job(
        title=job.title,
        department=job.department,
        location=job.location,
        type=job.type,
        salary=job.salary,
        description=job.description,
        requirements=job.requirements,
        benefits=job.benefits,
        tags=job.tags
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.put("/{job_id}", response_model=JobSchema)
def update_job(job_id: int, job: JobCreate, db: Session = Depends(get_db)):
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db_job.title = job.title
    db_job.department = job.department
    db_job.location = job.location
    db_job.type = job.type
    db_job.salary = job.salary
    db_job.description = job.description
    db_job.requirements = job.requirements
    db_job.benefits = job.benefits
    db_job.tags = job.tags
    
    db.commit()
    db.refresh(db_job)
    return db_job

@router.delete("/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db_job.is_active = False
    db.commit()
    return {"message": "Job deleted successfully"}

# Sample data endpoint
@router.get("/sample/data")
def get_sample_jobs():
    return [
        {
            "id": 1,
            "title": "Senior AI Security Engineer",
            "department": "Engineering",
            "location": "San Francisco, CA",
            "type": "Full-time",
            "salary": "$120,000 - $180,000",
            "description": "Join our team to develop cutting-edge AI-powered security solutions that protect organizations from sophisticated cyber threats.",
            "requirements": json.dumps([
                "5+ years experience in cybersecurity",
                "Strong Python and machine learning skills",
                "Experience with AI/ML frameworks",
                "Knowledge of security protocols and standards"
            ]),
            "benefits": json.dumps([
                "Competitive salary and equity",
                "Health, dental, and vision insurance",
                "Flexible work arrangements",
                "Professional development opportunities"
            ]),
            "is_active": True
        },
        {
            "id": 2,
            "title": "Cybersecurity Analyst",
            "department": "Security Operations",
            "location": "Remote",
            "type": "Full-time",
            "salary": "$80,000 - $120,000",
            "description": "Monitor and analyze security threats, investigate incidents, and help develop response strategies.",
            "requirements": json.dumps([
                "3+ years in security operations",
                "Experience with SIEM tools",
                "Knowledge of threat intelligence",
                "Strong analytical skills"
            ]),
            "benefits": json.dumps([
                "Remote work flexibility",
                "Comprehensive benefits package",
                "Training and certification support",
                "Career growth opportunities"
            ]),
            "is_active": True
        },
        {
            "id": 3,
            "title": "Product Manager - Security Solutions",
            "department": "Product",
            "location": "New York, NY",
            "type": "Full-time",
            "salary": "$100,000 - $150,000",
            "description": "Lead product strategy and development for our security platform, working with engineering and sales teams.",
            "requirements": json.dumps([
                "5+ years product management experience",
                "Background in cybersecurity or SaaS",
                "Strong technical and business acumen",
                "Excellent communication skills"
            ]),
            "benefits": json.dumps([
                "Competitive compensation",
                "Health and wellness benefits",
                "Stock options",
                "Professional development budget"
            ]),
            "is_active": True
        }
    ] 