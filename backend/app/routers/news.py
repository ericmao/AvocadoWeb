from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json
from datetime import datetime, timezone

from ..database import get_db
from ..models import News
from ..schemas import News as NewsSchema, NewsCreate

router = APIRouter()

@router.get("/", response_model=List[NewsSchema])
def get_news(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    news = db.query(News).filter(News.is_published == True).offset(skip).limit(limit).all()
    return news

@router.get("/admin/all", response_model=List[NewsSchema])
def get_all_news(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all news for admin interface (including unpublished)"""
    news = db.query(News).offset(skip).limit(limit).all()
    return news

@router.get("/{news_id}", response_model=NewsSchema)
def get_news_item(news_id: int, db: Session = Depends(get_db)):
    news_item = db.query(News).filter(News.id == news_id, News.is_published == True).first()
    if news_item is None:
        raise HTTPException(status_code=404, detail="News item not found")
    return news_item

@router.post("/", response_model=NewsSchema)
def create_news(news: NewsCreate, db: Session = Depends(get_db)):
    # 處理日期時區問題
    published_date = None
    if hasattr(news, 'published_date') and news.published_date:
        # 如果日期是字符串格式，轉換為 datetime
        if isinstance(news.published_date, str):
            published_date = datetime.fromisoformat(news.published_date.replace('Z', '+00:00'))
        else:
            published_date = news.published_date
    else:
        published_date = datetime.now(timezone.utc)
    
    # 處理圖片，限制最多3張
    images = news.images if hasattr(news, 'images') and news.images else []
    if len(images) > 3:
        images = images[:3]
    
    db_news = News(
        title=news.title,
        content=news.content,
        category=news.category,
        published_date=published_date,
        is_published=news.is_published if hasattr(news, 'is_published') else True,
        images=images
    )
    db.add(db_news)
    db.commit()
    db.refresh(db_news)
    return db_news

@router.put("/{news_id}", response_model=NewsSchema)
def update_news(news_id: int, news: NewsCreate, db: Session = Depends(get_db)):
    db_news = db.query(News).filter(News.id == news_id).first()
    if db_news is None:
        raise HTTPException(status_code=404, detail="News item not found")
    
    db_news.title = news.title
    db_news.content = news.content
    db_news.category = news.category
    
    # 處理日期時區問題
    if hasattr(news, 'published_date') and news.published_date:
        if isinstance(news.published_date, str):
            db_news.published_date = datetime.fromisoformat(news.published_date.replace('Z', '+00:00'))
        else:
            db_news.published_date = news.published_date
    
    if hasattr(news, 'is_published'):
        db_news.is_published = news.is_published
    
    # 處理圖片，限制最多3張
    if hasattr(news, 'images') and news.images is not None:
        images = news.images if news.images else []
        if len(images) > 3:
            images = images[:3]
        db_news.images = images
    
    db.commit()
    db.refresh(db_news)
    return db_news

@router.delete("/{news_id}")
def delete_news(news_id: int, db: Session = Depends(get_db)):
    db_news = db.query(News).filter(News.id == news_id).first()
    if db_news is None:
        raise HTTPException(status_code=404, detail="News item not found")
    
    db_news.is_published = False
    db.commit()
    return {"message": "News item deleted successfully"}

# Sample data endpoint
@router.get("/sample/data")
def get_sample_news():
    return [
        {
            "id": 1,
            "title": "Avocado.ai Launches New AI-Powered Security Platform",
            "content": "Avocado.ai is proud to announce the launch of our latest AI-powered security platform, designed to provide comprehensive protection against evolving cyber threats.",
            "category": "Company News",
            "published_date": datetime.now(timezone.utc).isoformat(),
            "is_published": True
        },
        {
            "id": 2,
            "title": "Avocado.ai Recognized as Leader in Cybersecurity Innovation",
            "content": "Avocado.ai has been recognized as a leader in cybersecurity innovation by leading industry analysts, highlighting our commitment to advancing security technology.",
            "category": "Awards",
            "published_date": datetime.now(timezone.utc).isoformat(),
            "is_published": True
        },
        {
            "id": 3,
            "title": "New Partnership with Fortune 500 Companies",
            "content": "Avocado.ai has established new partnerships with several Fortune 500 companies, expanding our reach and impact in the cybersecurity industry.",
            "category": "Partnerships",
            "published_date": datetime.now(timezone.utc).isoformat(),
            "is_published": True
        }
    ] 