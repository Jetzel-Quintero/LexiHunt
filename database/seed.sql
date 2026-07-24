-- Use Database
USE lexihunt_app_db;
GO

-- Insert Categories
INSERT INTO categories (name_en, name_es, icon_class) VALUES 
('Animals', 'Animales', 'fa-cat'),
('Food', 'Comida', 'fa-pizza-slice'),
('Nature', 'Naturaleza', 'fa-sun'),
('Colors', 'Colores', 'fa-heart');
GO

-- Insert Vocabulary Words (Linked to Categories)
-- Category 1: Animals (ID: 1)
INSERT INTO vocabulary_words (category_id, english_word, spanish_word, image_url, example_sentence) VALUES 
(1, 'CAT', 'Gato', '/assets/images/animals/cat.png', 'The cat sleeps on the sofa.'),
(1, 'DOG', 'Perro', '/assets/images/animals/dog.png', 'The dog wags its tail happily.'),
(1, 'LION', 'León', '/assets/images/animals/lion.png', 'The lion roars loudly.');

-- Category 2: Food (ID: 2)
INSERT INTO vocabulary_words (category_id, english_word, spanish_word, image_url, example_sentence) VALUES 
(2, 'APPLE', 'Manzana', '/assets/images/food/apple.png', 'An apple a day is good for health.'),
(2, 'PIZZA', 'Pizza', '/assets/images/food/pizza.png', 'I love cheese pizza!');
GO