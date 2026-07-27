import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView, Platform} from 'react-native';
import axios from 'axios';

import { styles } from './styles';
import { generateWordSearchGrid } from './utils/wordSearch';
import CategoryList from './components/CategoryList';
import GameBoard from './components/GameBoard';

import WinModal from './components/WinModal';


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

  // States for the Timer and the Victory
  const [timer, setTimer] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);

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
  

  // Stopwatch Logic
  useEffect(() => {
    let interval = null;
    if (selectedCategory && !isGameWon && !loadingWords) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [selectedCategory, isGameWon, loadingWords]);



const handleSelectCategory = (category) => {
    const catId = category.id || category.category_id;
    setSelectedCategory(category);
    setLoadingWords(true);
    setSelectedCells([]); 
    setFoundWords([]);
    setTimer(0);
    setIsGameWon(false);      
    
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
    if (isGameWon) return;

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
      const updatedFoundWords = [...foundWords, matchedWordObj.english_word];
      setFoundWords(updatedFoundWords);
      setSelectedCells([]);

    // We check if he has already found all the words to activate the victory
    if (updatedFoundWords.length === vocabulary.length) {
        setIsGameWon(true);
    }
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
      <View style={{ flex: 1 }}>
        <GameBoard 
          selectedCategory={selectedCategory}
          onBack={() => setSelectedCategory(null)}
          loadingWords={loadingWords}
          vocabulary={vocabulary}
          foundWords={foundWords}
          grid={grid}
          selectedCells={selectedCells}
          onCellPress={handleCellPress}
          timer={timer}
        />
        <WinModal 
          visible={isGameWon} 
          time={timer} 
          onPlayAgain={() => setSelectedCategory(null)} 
        />
      </View>
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