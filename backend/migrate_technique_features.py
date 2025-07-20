import psycopg2
from psycopg2.extras import RealDictCursor
import json

# Database connection parameters
DB_PARAMS = {
    'host': 'db',  # Docker service name
    'port': 5432,
    'database': 'avocado_db',
    'user': 'avocado_user',
    'password': 'avocado_pass'
}

def migrate_technique_features():
    """Migrate Technique table to use features instead of methodology and applications"""
    conn = None
    try:
        # Connect to database
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()
        
        # Check if features column already exists
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'techniques' AND column_name = 'features'
        """)
        
        if cursor.fetchone():
            print("Features column already exists in techniques table")
            return
        
        # Add features column
        cursor.execute("""
            ALTER TABLE techniques 
            ADD COLUMN features VARCHAR[]
        """)
        
        # Update existing records with sample data
        cursor.execute("""
            UPDATE techniques 
            SET features = ARRAY['Feature 1', 'Feature 2', 'Feature 3']
            WHERE features IS NULL
        """)
        
        # Make features column NOT NULL
        cursor.execute("""
            ALTER TABLE techniques 
            ALTER COLUMN features SET NOT NULL
        """)
        
        # Drop old columns if they exist
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'techniques' AND column_name IN ('methodology', 'applications')
        """)
        
        existing_columns = [row[0] for row in cursor.fetchall()]
        
        if 'methodology' in existing_columns:
            cursor.execute("ALTER TABLE techniques DROP COLUMN methodology")
            print("Dropped methodology column")
            
        if 'applications' in existing_columns:
            cursor.execute("ALTER TABLE techniques DROP COLUMN applications")
            print("Dropped applications column")
        
        # Commit changes
        conn.commit()
        print("Successfully migrated techniques table to use features column")
        
    except Exception as e:
        print(f"Error during migration: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    migrate_technique_features() 