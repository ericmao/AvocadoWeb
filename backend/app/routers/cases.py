from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json

from ..database import get_db
from ..models import CaseStudy
from ..schemas import CaseStudy as CaseStudySchema, CaseStudyCreate

router = APIRouter()

@router.get("/", response_model=List[CaseStudySchema])
def get_case_studies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    cases = db.query(CaseStudy).filter(CaseStudy.is_active == True).offset(skip).limit(limit).all()
    return cases

@router.get("/{case_id}", response_model=CaseStudySchema)
def get_case_study(case_id: int, db: Session = Depends(get_db)):
    case = db.query(CaseStudy).filter(CaseStudy.id == case_id, CaseStudy.is_active == True).first()
    if case is None:
        raise HTTPException(status_code=404, detail="Case study not found")
    return case

@router.post("/", response_model=CaseStudySchema)
def create_case_study(case: CaseStudyCreate, db: Session = Depends(get_db)):
    db_case = CaseStudy(
        title=case.title,
        industry=case.industry,
        challenge=case.challenge,
        solution=case.solution,
        results=case.results
    )
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return db_case

@router.put("/{case_id}", response_model=CaseStudySchema)
def update_case_study(case_id: int, case: CaseStudyCreate, db: Session = Depends(get_db)):
    db_case = db.query(CaseStudy).filter(CaseStudy.id == case_id).first()
    if db_case is None:
        raise HTTPException(status_code=404, detail="Case study not found")
    
    db_case.title = case.title
    db_case.industry = case.industry
    db_case.challenge = case.challenge
    db_case.solution = case.solution
    db_case.results = case.results
    
    db.commit()
    db.refresh(db_case)
    return db_case

@router.delete("/{case_id}")
def delete_case_study(case_id: int, db: Session = Depends(get_db)):
    db_case = db.query(CaseStudy).filter(CaseStudy.id == case_id).first()
    if db_case is None:
        raise HTTPException(status_code=404, detail="Case study not found")
    
    db_case.is_active = False
    db.commit()
    return {"message": "Case study deleted successfully"}

# Sample data endpoint
@router.get("/sample/data")
def get_sample_cases():
    return [
        {
            "id": 1,
            "title": "Fortune 500 Financial Institution",
            "industry": "Financial Services",
            "challenge": "Faced sophisticated cyber attacks targeting customer data and financial transactions.",
            "solution": "Implemented Avocado AI Sentinel with behavioral analytics and real-time threat detection.",
            "results": json.dumps([
                "99.9% threat detection rate",
                "60% reduction in false positives",
                "Real-time response to threats",
                "Compliance with financial regulations"
            ]),
            "is_active": True
        },
        {
            "id": 2,
            "title": "Global Healthcare Provider",
            "industry": "Healthcare",
            "challenge": "Needed to protect sensitive patient data while maintaining system accessibility for medical staff.",
            "solution": "Deployed Avocado Zero Trust framework with advanced access controls and monitoring.",
            "results": json.dumps([
                "Zero data breaches in 2 years",
                "HIPAA compliance achieved",
                "Improved system performance",
                "Enhanced user experience"
            ]),
            "is_active": True
        },
        {
            "id": 3,
            "title": "E-commerce Platform",
            "industry": "Retail",
            "challenge": "Experienced frequent DDoS attacks and payment fraud attempts.",
            "solution": "Integrated Avocado Monitor with AI-powered fraud detection and automated response.",
            "results": json.dumps([
                "95% reduction in fraud attempts",
                "99.9% uptime maintained",
                "Automated threat response",
                "Improved customer trust"
            ]),
            "is_active": True
        }
    ] 