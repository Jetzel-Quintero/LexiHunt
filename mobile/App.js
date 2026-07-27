import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView, Platform} from 'react-native';
import axios from 'axios';

// --- FUNCIÓN PARA GENERAR LA SOPA DE LETRAS AUTOMÁTICAMENTE ---
const generateWordSearchGrid = (wordsList) => {
  const GRID_SIZE = 10;
  // 1. Inicializamos una matriz vacía de 10x10 con espacios
  let grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));

  // Direcciones posibles: Horizontal, Vertical, Diagonal
  const directions = [
    { r: 0, c: 1 },   // Horizontal derecha
    { r: 1, c: 0 },   // Vertical abajo
    { r: 1, c: 1 }    // Diagonal abajo-derecha
  ];

  // 2. Insertamos cada palabra del vocabulario en la cuadrícula
  wordsList.forEach(item => {
    let word = item.english_word.toUpperCase().replace(/[^A-Z]/g, ''); // Limpiamos espacios o símbolos
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      attempts++;
      let dir = directions[Math.floor(Math.random() * directions.length)];
      let row = Math.floor(Math.random() * GRID_SIZE);
      let col = Math.floor(Math.random() * GRID_SIZE);

      // Verificamos si cabe en la dirección elegida
      let endRow = row + dir.r * (word.length - 1);
      let endCol = col + dir.c * (word.length - 1);

      if (endRow >= 0 && endRow < GRID_SIZE && endCol >= 0 && endCol < GRID_SIZE) {
        let fits = true;
        for (let i = 0; i < word.length; i++) {
          let currR = row + dir.r * i;
          let currC = col + dir.c * i;
          if (grid[currR][currC] !== '' && grid[currR][currC] !== word[i]) {
            fits = false;
            break;
          }
        }

        // Si cabe, la colocamos letra por letra
        if (fits) {
          for (let i = 0; i < word.length; i++) {
            grid[row + dir.r * i][col + dir.c * i] = word[i];
          }
          placed = true;
        }
      }
    }
  });

  // 3. Rellenamos los espacios vacíos con letras aleatorias del alfabeto
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return grid;
};

export default function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [vocabulary, setVocabulary] = useState([]);
  const [grid, setGrid] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingWords, setLoadingWords] = useState(false);
  const [error, setError] = useState(null);

  // URL base adaptada para entorno local (web o emulador)
  const API_BASE_URL = 'http://localhost:8000/api';

  useEffect(() => {
    axios.get(`${API_BASE_URL}/categories`)
      .then(response => {
        console.log("DATOS RECIBIDOS:", response.data);
        setCategories(response.data.categories || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("ERROR DE CONEXIÓN:", err);
        setError('Could not connect to the backend server.');
        setLoading(false);
      });
  }, []);

const handleSelectCategory = (category) => {
    const catId = category.id || category.category_id;
    setSelectedCategory(category);
    setLoadingWords(true);
    
    axios.get(`${API_BASE_URL}/vocabulary/${catId}`)
      .then(response => {
        const words = response.data.vocabulary || [];
        setVocabulary(words);
        
        // ¡Generamos la sopa de letras con las palabras obtenidas!
        const generatedGrid = generateWordSearchGrid(words);
        setGrid(generatedGrid);

        setLoadingWords(false);
      })
      .catch(err => {
        console.error("ERROR FETCHING VOCABULARY:", err);
        setVocabulary([]);
        setLoadingWords(false);
      });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.text}>Loading LexiHunt Categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

// Vista de Vocabulario y Sopa de Letras si hay una categoría seleccionada
  if (selectedCategory) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedCategory(null)}>
          <Text style={styles.backButtonText}>← Back to Categories</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>{selectedCategory.name_en} 🧩</Text>
        <Text style={styles.subtitle}>Find these words in the puzzle:</Text>

        {loadingWords ? (
          <ActivityIndicator size="small" color="#4f46e5" style={{ marginTop: 20 }} />
        ) : (
          <>
            {/* 1. LISTA DE PALABRAS A ENCONTRAR */}
            <FlatList
              data={vocabulary}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ maxHeight: 90, marginBottom: 15 }}
              renderItem={({ item }) => (
                <View style={styles.wordChip}>
                  <Text style={styles.chipText}>{item.english_word}</Text>
                </View>
              )}
            />

            {/* 2. TABLERO / CUADRÍCULA DE LA SOPA DE LETRAS */}
            <View style={styles.gridContainer}>
              {grid.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.gridRow}>
                  {row.map((letter, colIndex) => (
                    <TouchableOpacity key={colIndex} style={styles.gridCell}>
                      <Text style={styles.cellText}>{letter}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </>
        )}
      </SafeAreaView>
    );
  }

  // Vista Principal de Categorías
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>LexiHunt 🎮</Text>
      <Text style={styles.subtitle}>Select a category to play</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleSelectCategory(item)}>
            <Text style={styles.cardTitle}>{item.name_en} / {item.name_es}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 40, paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 20 },
  text: { marginTop: 10, color: '#475569' },
  errorText: { color: '#dc2626', fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
  card: { backgroundColor: '#ffffff', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#334155' },
  backButton: { marginBottom: 15 },
  backButtonText: { fontSize: 16, color: '#4f46e5', fontWeight: '600' },
  wordCard: { backgroundColor: '#ffffff', padding: 15, borderRadius: 8, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#4f46e5', elevation: 2 },
  wordText: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  wordTranslation: { color: '#64748b', fontWeight: 'normal' },
  exampleText: { fontSize: 13, color: '#64748b', fontStyle: 'italic', marginTop: 4 },

  gridContainer: {
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    margin: 1,
    borderRadius: 4,
  },
  cellText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
  },
  wordChip: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    justifyContent: 'center',
    height: 40,
  },
  chipText: {
    color: '#4f46e5',
    fontWeight: 'bold',
    fontSize: 14,
  },
});