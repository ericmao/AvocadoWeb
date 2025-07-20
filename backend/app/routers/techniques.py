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

# Sample data endpoint with new AI techniques
@router.get("/sample/data")
def get_sample_techniques():
    return [
        {
            "id": 1,
            "name": "1️⃣ AI-Powered Threat Detection & Behavioral Analytics",
            "description": "Leverage machine learning and behavioral models to detect evolving threats in real-time.",
            "features": ["Pattern Recognition", "Anomaly Detection", "Predictive Attack Analysis", "Machine Learning-Based Behavioral Profiling"],
            "category": "AI/ML",
            "is_active": True
        },
        {
            "id": 2,
            "name": "2️⃣ Edge AI Agentic RAG Sequence Analysis Engine",
            "description": "Generic Edge AI Detection Engine for Suspicious Sequence Analysis. A software-hardware integrated solution deploying lightweight AI agents at the edge (Wi-Fi mesh, firewalls, CPE, IoT gateways) for continuous local detection.",
            "features": ["Edge AI Inference on network devices", "Encrypted Traffic Behavior Analysis", "Local Blocking & Cloud Collaborative Response", "Compatible with OpenWRT, prplOS, RDK-B, Containers", "Agentic RAG: Retrieval-Augmented Generation with temporal and semantic memory for adaptive threat detection"],
            "category": "Edge AI",
            "is_active": True
        },
        {
            "id": 3,
            "name": "3️⃣ AI-Augmented XDR, SIEM & SenseL Language Model for Threat Intelligence",
            "description": "Combine XDR and SIEM with AI SenseL LLM for enhanced threat intelligence, incident correlation, and response.",
            "features": ["Threat Hunting & Incident Correlation", "Vulnerability and Risk Assessment", "Automated Report Generation with LLM", "Kill Chain Mapping and Attack Contextualization"],
            "category": "XDR/SIEM",
            "is_active": True
        },
        {
            "id": 4,
            "name": "4️⃣ AI-Driven War Room & Response Support Services",
            "description": "High-Level AI Security War Room with LLM Integration. Empower your SOC operations with an AI-powered war room for real-time decision support.",
            "features": ["Real-Time Threat Visualization Dashboard", "LLM-Assisted Response Playbook Recommendations", "Digital Twin Incident Simulation & Response Training", "Multilingual Threat Intelligence Analysis"],
            "category": "SOC/War Room",
            "is_active": True
        },
        {
            "id": 5,
            "name": "5️⃣ AI-Enhanced Breach & Attack Simulation (BAS)",
            "description": "Transform cyber readiness exercises with AI-powered BAS to continuously validate detection and response capabilities.",
            "features": ["Automated APT Simulation", "IoT/OT Attack Scenarios", "Hybrid Red & Blue Team Simulations", "AI-Driven Scenario Generation & Adaptation"],
            "category": "BAS/Simulation",
            "is_active": True
        }
    ]

# Initialize database with default techniques
@router.post("/init/default")
def initialize_default_techniques(db: Session = Depends(get_db)):
    # Clear existing techniques
    db.query(Technique).delete()
    db.commit()
    
    # Add default techniques
    default_techniques = [
        {
            "name": "1️⃣ AI-Powered Threat Detection & Behavioral Analytics",
            "description": "Leverage machine learning and behavioral models to detect evolving threats in real-time.",
            "features": ["Pattern Recognition", "Anomaly Detection", "Predictive Attack Analysis", "Machine Learning-Based Behavioral Profiling"],
            "category": "AI/ML"
        },
        {
            "name": "2️⃣ Edge AI Agentic RAG Sequence Analysis Engine",
            "description": "Generic Edge AI Detection Engine for Suspicious Sequence Analysis. A software-hardware integrated solution deploying lightweight AI agents at the edge (Wi-Fi mesh, firewalls, CPE, IoT gateways) for continuous local detection.",
            "features": ["Edge AI Inference on network devices", "Encrypted Traffic Behavior Analysis", "Local Blocking & Cloud Collaborative Response", "Compatible with OpenWRT, prplOS, RDK-B, Containers", "Agentic RAG: Retrieval-Augmented Generation with temporal and semantic memory for adaptive threat detection"],
            "category": "Edge AI"
        },
        {
            "name": "3️⃣ AI-Augmented XDR, SIEM & SenseL Language Model for Threat Intelligence",
            "description": "Combine XDR and SIEM with AI SenseL LLM for enhanced threat intelligence, incident correlation, and response.",
            "features": ["Threat Hunting & Incident Correlation", "Vulnerability and Risk Assessment", "Automated Report Generation with LLM", "Kill Chain Mapping and Attack Contextualization"],
            "category": "XDR/SIEM"
        },
        {
            "name": "4️⃣ AI-Driven War Room & Response Support Services",
            "description": "High-Level AI Security War Room with LLM Integration. Empower your SOC operations with an AI-powered war room for real-time decision support.",
            "features": ["Real-Time Threat Visualization Dashboard", "LLM-Assisted Response Playbook Recommendations", "Digital Twin Incident Simulation & Response Training", "Multilingual Threat Intelligence Analysis"],
            "category": "SOC/War Room"
        },
        {
            "name": "5️⃣ AI-Enhanced Breach & Attack Simulation (BAS)",
            "description": "Transform cyber readiness exercises with AI-powered BAS to continuously validate detection and response capabilities.",
            "features": ["Automated APT Simulation", "IoT/OT Attack Scenarios", "Hybrid Red & Blue Team Simulations", "AI-Driven Scenario Generation & Adaptation"],
            "category": "BAS/Simulation"
        }
    ]
    
    for technique_data in default_techniques:
        db_technique = Technique(**technique_data)
        db.add(db_technique)
    
    db.commit()
    return {"message": "Default techniques initialized successfully"} 