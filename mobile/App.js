import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView, Platform} from 'react-native';
import axios from 'axios';
import { styles } from './styles';
import { generateWordSearchGrid } from './utils/wordSearch';
import CategoryList from './components/CategoryList';
import GameBoard from './components/GameBoard';


export default function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [vocabulary, setVocabulary] = useState([]);
  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingWords, setLoadingWords] = useState(false);
  const [error, setError] = useState(null);

  // Base URL for on-premises
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
    setSelectedCells([]); 
    setFoundWords([]);      
    
    axios.get(`${API_BASE_URL}/vocabulary/${catId}`)
      .then(response => {
        const words = response.data.vocabulary || [];
        setVocabulary(words);
        
        // We generate the word search with the words obtained!
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

// Handle the tap in each cell of the word search
const handleCellPress = (r, c, letter) => {
  const exists = selectedCells.some(cell => cell.r === r && cell.c === c);
  let updatedCells = [];

  if (exists) {
    updatedCells = selectedCells.filter(cell => !(cell.r === r && cell.c === c));
  } else {
    updatedCells = [...selectedCells, { r, c, letter }];
  }

  setSelectedCells(updatedCells);

  const formedWord = updatedCells.map(cell => cell.letter).join('');
    
  const matchedWordObj = vocabulary.find(
    item => item.english_word.toUpperCase() === formedWord && !foundWords.includes(item.english_word)
  );

  if (matchedWordObj) {
    setFoundWords([...foundWords, matchedWordObj.english_word]);
    setSelectedCells([]);
  }
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


// GameBoard
  if (selectedCategory) {
    return (
      <GameBoard 
        selectedCategory={selectedCategory}
        onBack={() => setSelectedCategory(null)}
        loadingWords={loadingWords}
        vocabulary={vocabulary}
        foundWords={foundWords}
        grid={grid}
        selectedCells={selectedCells}
        onCellPress={handleCellPress}
      />
    );
  }

  // CategoryList
  return (
    <CategoryList 
      categories={categories} 
      onSelectCategory={handleSelectCategory} 
    />
  );
}