from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json

from ..database import get_db
from ..models import Technique
from ..schemas import Technique as TechniqueSchema, TechniqueCreate

router = APIRouter()

@router.get("/", response_model=List[TechniqueSchema])
def get_techniques(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    techniques = db.query(Technique).filter(Technique.is_active == True).offset(skip).limit(limit).all()
    return techniques

@router.get("/{technique_id}", response_model=TechniqueSchema)
def get_technique(technique_id: int, db: Session = Depends(get_db)):
    technique = db.query(Technique).filter(Technique.id == technique_id, Technique.is_active == True).first()
    if technique is None:
        raise HTTPException(status_code=404, detail="Technique not found")
    return technique

@router.post("/", response_model=TechniqueSchema)
def create_technique(technique: TechniqueCreate, db: Session = Depends(get_db)):
    db_technique = Technique(
        name=technique.name,
        description=technique.description,
        features=technique.features,
        category=technique.category
    )
    db.add(db_technique)
    db.commit()
    db.refresh(db_technique)
    return db_technique

@router.put("/{technique_id}", response_model=TechniqueSchema)
def update_technique(technique_id: int, technique: TechniqueCreate, db: Session = Depends(get_db)):
    db_technique = db.query(Technique).filter(Technique.id == technique_id).first()
    if db_technique is None:
        raise HTTPException(status_code=404, detail="Technique not found")
    
    db_technique.name = technique.name
    db_technique.description = technique.description
    db_technique.features = technique.features
    db_technique.category = technique.category
    
    db.commit()
    db.refresh(db_technique)
    return db_technique

@router.delete("/{technique_id}")
def delete_technique(technique_id: int, db: Session = Depends(get_db)):
    db_technique = db.query(Technique).filter(Technique.id == technique_id).first()
    if db_technique is None:
        raise HTTPException(status_code=404, detail="Technique not found")
    
    db_technique.is_active = False
    db.commit()
    return {"message": "Technique deleted successfully"}

# Sample data endpoint
@router.get("/sample/data")
def get_sample_techniques():
    return [
        {
            "id": 1,
            "name": "Machine Learning",
            "description": "Advanced ML algorithms that learn from patterns and adapt to new threats in real-time.",
            "features": json.dumps(["Pattern Recognition", "Anomaly Detection", "Predictive Analytics", "Behavioral Analysis"]),
            "category": "AI/ML",
            "is_active": True
        },
        {
            "id": 2,
            "name": "Threat Intelligence",
            "description": "Comprehensive threat intelligence gathering and analysis from global sources.",
            "features": json.dumps(["Real-time Monitoring", "Threat Hunting", "Vulnerability Assessment", "Risk Analysis"]),
            "category": "Security",
            "is_active": True
        },
        {
            "id": 3,
            "name": "Automated Response",
            "description": "Intelligent automation that responds to threats faster than human operators.",
            "features": json.dumps(["Instant Blocking", "Incident Response", "Workflow Automation", "Alert Management"]),
            "category": "Automation",
            "is_active": True
        },
        {
            "id": 4,
            "name": "Zero Trust Security",
            "description": "Implementing zero trust principles across all network and application layers.",
            "features": json.dumps(["Identity Verification", "Access Control", "Network Segmentation", "Continuous Monitoring"]),
            "category": "Security",
            "is_active": True
        },
        {
            "id": 5,
            "name": "Behavioral Analytics",
            "description": "Analyzing user and system behavior to detect suspicious activities.",
            "features": json.dumps(["User Behavior Analysis", "System Monitoring", "Risk Scoring", "Threat Correlation"]),
            "category": "Analytics",
            "is_active": True
        },
        {
            "id": 6,
            "name": "AI-Powered Detection",
            "description": "Next-generation AI systems that detect and prevent advanced persistent threats.",
            "features": json.dumps(["Deep Learning", "Neural Networks", "Natural Language Processing", "Computer Vision"]),
            "category": "AI/ML",
            "is_active": True
        }
    ] 