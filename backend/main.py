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

@app.get("/api/vocabulary/{category_id}")
def get_vocabulary_by_category(category_id: int):
    conn = get_db_connection()
    if not conn:
        return {"error": "Database connection failed"}
    
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, english_word, spanish_word, image_url, example_sentence FROM vocabulary_words WHERE category_id = ?",
        category_id
    )
    rows = cursor.fetchall()
    
    words = []
    for row in rows:
        words.append({
            "id": row[0],
            "english_word": row[1],
            "spanish_word": row[2],
            "image_url": row[3],
            "example_sentence": row[4]
        })
    
    cursor.close()
    conn.close()
    return {"category_id": category_id, "vocabulary": words}