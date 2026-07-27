// mobile/components/GameBoard.js
import React from 'react';
import { Text, View, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { styles } from '../styles';

export default function GameBoard({ 
  selectedCategory, 
  onBack, 
  loadingWords, 
  vocabulary, 
  foundWords, 
  grid, 
  selectedCells, 
  onCellPress,
  timer // <--- Recibimos el tiempo
}) {
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#4f46e5' }}>⏱️ {formatTime(timer)}</Text>
      </View>
      
      <Text style={styles.title}>{selectedCategory.name_en} 🧩</Text>
      <Text style={styles.subtitle}>Find these words in the puzzle:</Text>

      {loadingWords ? (
        <ActivityIndicator size="small" color="#4f46e5" style={{ marginTop: 20 }} />
      ) : (
        <>
          <FlatList
            data={vocabulary}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ maxHeight: 90, marginBottom: 15 }}
            renderItem={({ item }) => {
              const isFound = foundWords.includes(item.english_word);
              return (
                <View style={[styles.wordChip, isFound && styles.wordChipFound]}>
                  <Text style={[styles.chipText, isFound && styles.chipTextFound]}>
                    {item.english_word} {isFound ? '✓' : ''}
                  </Text>
                </View>
              );
            }}
          />

          <View style={styles.gridContainer}>
            {grid.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.gridRow}>
                {row.map((letter, colIndex) => {
                  const isSelected = selectedCells.some(cell => cell.r === rowIndex && cell.c === colIndex);
                  return (
                    <TouchableOpacity 
                      key={colIndex} 
                      style={[styles.gridCell, isSelected && styles.gridCellSelected]}
                      onPress={() => onCellPress(rowIndex, colIndex, letter)}
                    >
                      <Text style={[styles.cellText, isSelected && styles.cellTextSelected]}>
                        {letter}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}