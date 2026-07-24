from fastapi import FastAPI
from backend.db_connection import get_db_connection

app = FastAPI(title="LexiHunt API", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "Welcome to LexiHunt API! The backend is running successfully."}

@app.get("/api/categories")
def get_categories():
    conn = get_db_connection()
    if not conn:
        return {"error": "Database connection failed"}
    
    cursor = conn.cursor()
    cursor.execute("SELECT id, name_en, name_es, icon_class FROM categories")
    rows = cursor.fetchall()
    
    categories = []
    for row in rows:
        categories.append({
            "id": row[0],
            "name_en": row[1],
            "name_es": row[2],
            "icon_class": row[3]
        })
    
    cursor.close()
    conn.close()
    return {"categories": categories}