// mobile/App.js
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
  
  // Estado correcto de las rutas y colores por palabra encontrada
  const [foundWordPaths, setFoundWordPaths] = useState([]); 
  
  const [loading, setLoading] = useState(true);
  const [loadingWords, setLoadingWords] = useState(false);
  const [error, setError] = useState(null);

  // States for the Timer and the Victory
  const [timer, setTimer] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);

  // Lista de colores dinámicos para el contorno de las palabras encontradas
  const COLORS_LIST = ['#3b82f6', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4'];

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
    setFoundWordPaths([]); // Reiniciamos las rutas con color
    setFoundWords([]);
    setTimer(0);
    setIsGameWon(false);      
    
    axios.get(`${API_BASE_URL}/vocabulary/${catId}`)
      .then(response => {
        const words = response.data.vocabulary || [];
        setVocabulary(words);
        

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

  // Función auxiliar para verificar que las celdas seleccionadas forman una línea recta consecutiva
  const isValidLine = (cells) => {
    if (cells.length <= 1) return true;
    
    const dr = cells[1].r - cells[0].r;
    const dc = cells[1].c - cells[0].c;
    
    const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
    const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
    
    for (let i = 1; i < cells.length; i++) {
      const expectedR = cells[0].r + stepR * i;
      const expectedC = cells[0].c + stepC * i;
      
      const match = cells.some(cell => cell.r === expectedR && cell.c === expectedC);
      if (!match) return false;
    }
    return true;
  };

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

    // Al seleccionar una palabra correcta:
    if (matchedWordObj) {
      if (isValidLine(updatedCells)) {
        const newFoundWords = [...foundWords, matchedWordObj.english_word];
        setFoundWords(newFoundWords);
        
        // Asignar un color único por cada palabra encontrada de forma cíclica
        const randomColor = COLORS_LIST[newFoundWords.length % COLORS_LIST.length];
        
        setFoundWordPaths(prev => [
          ...prev, 
          { word: matchedWordObj.english_word, cells: updatedCells, color: randomColor }
        ]);
        
        setSelectedCells([]);
        if (newFoundWords.length === vocabulary.length) {
          setIsGameWon(true);
        }
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
          foundWordPaths={foundWordPaths} // <--- Pasamos las rutas y colores correctamente
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