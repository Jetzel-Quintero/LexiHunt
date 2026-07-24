-- Crear la Base de Datos (Validando si ya existe de forma segura en SQL Server)
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'lexihunt_app_db')
BEGIN
    CREATE DATABASE lexihunt_app_db;
END
GO

-- Usar la Base de Datos
USE lexihunt_app_db;
GO

-- Tabla de Categorías
CREATE TABLE categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name_en VARCHAR(50) NOT NULL,
    name_es VARCHAR(50) NOT NULL,
    icon_class VARCHAR(50) NOT NULL
);
GO

-- Tabla de Palabras de Vocabulario
CREATE TABLE vocabulary_words (
    id INT IDENTITY(1,1) PRIMARY KEY,
    category_id INT NOT NULL,
    english_word VARCHAR(50) NOT NULL,
    spanish_word VARCHAR(50) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    example_sentence VARCHAR(255) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
GO

-- Tabla de Progreso del Usuario
CREATE TABLE user_progress (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    total_stars INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE()
);
GO