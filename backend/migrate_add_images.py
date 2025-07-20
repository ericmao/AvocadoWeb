#!/usr/bin/env python3
"""
Database migration script to add images column to news table
"""
import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

# Database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://avocado_user:avocado_pass@localhost:5432/avocado_db")

def migrate():
    """Add images column to news table"""
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        try:
            # Check if images column already exists
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'news' AND column_name = 'images'
            """))
            
            if result.fetchone():
                print("✅ Images column already exists in news table")
                return
            
            # Add images column
            conn.execute(text("""
                ALTER TABLE news 
                ADD COLUMN images VARCHAR[] DEFAULT '{}'
            """))
            
            conn.commit()
            print("✅ Successfully added images column to news table")
            
        except Exception as e:
            print(f"❌ Error adding images column: {e}")
            conn.rollback()
            sys.exit(1)

if __name__ == "__main__":
    print("🔄 Starting database migration...")
    migrate()
    print("✅ Migration completed successfully!") 