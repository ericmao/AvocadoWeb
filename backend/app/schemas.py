from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Authentication schemas
class LoginCredentials(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Contact schemas
class ContactBase(BaseModel):
    name: str
    email: str
    company: Optional[str] = None
    phone: Optional[str] = None
    message: str
    interest: str

class ContactCreate(ContactBase):
    pass

class Contact(ContactBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Job schemas
class JobBase(BaseModel):
    title: str
    department: str
    location: str
    type: str
    salary: str
    description: str
    requirements: List[str]
    benefits: List[str]
    tags: List[str] = []

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = None
    salary: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = None
    benefits: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    is_active: Optional[bool] = None

class Job(JobBase):
    id: int
    posted_date: datetime
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# News schemas
class NewsBase(BaseModel):
    title: str
    content: str
    category: str

class NewsCreate(NewsBase):
    published_date: Optional[datetime] = None
    is_published: Optional[bool] = True
    images: Optional[List[str]] = []

class NewsUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    published_date: Optional[datetime] = None
    is_published: Optional[bool] = None
    images: Optional[List[str]] = None

class News(NewsBase):
    id: int
    published_date: datetime
    is_published: bool
    images: List[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Case schemas
class CaseBase(BaseModel):
    title: str
    industry: str
    challenge: str
    solution: str
    results: List[str]

class CaseCreate(CaseBase):
    pass

class CaseUpdate(BaseModel):
    title: Optional[str] = None
    industry: Optional[str] = None
    challenge: Optional[str] = None
    solution: Optional[str] = None
    results: Optional[List[str]] = None
    is_active: Optional[bool] = None

class Case(CaseBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Product schemas
class ProductBase(BaseModel):
    name: str
    category: str
    description: str
    features: List[str]
    price: str

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    price: Optional[str] = None
    is_active: Optional[bool] = None

class Product(ProductBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Technique schemas
class TechniqueBase(BaseModel):
    name: str
    category: str
    description: str
    features: List[str]

class TechniqueCreate(TechniqueBase):
    pass

class TechniqueUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    is_active: Optional[bool] = None

class Technique(TechniqueBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# User schemas
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True 