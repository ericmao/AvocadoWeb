#!/usr/bin/env python3
"""
Database migration script to add tags column to jobs table
"""
import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

# Database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://avocado_user:avocado_pass@localhost:5432/avocado_db")

def migrate():
    """Add tags column to jobs table"""
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        try:
            # Check if tags column already exists
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'jobs' AND column_name = 'tags'
            """))
            
            if result.fetchone():
                print("✅ Tags column already exists in jobs table")
                return
            
            # Add tags column
            conn.execute(text("""
                ALTER TABLE jobs 
                ADD COLUMN tags VARCHAR[] DEFAULT '{}'
            """))
            
            conn.commit()
            print("✅ Successfully added tags column to jobs table")
            
        except Exception as e:
            print(f"❌ Error adding tags column: {e}")
            conn.rollback()
            sys.exit(1)

if __name__ == "__main__":
    print("🔄 Starting database migration...")
    migrate()
    print("✅ Migration completed successfully!") 