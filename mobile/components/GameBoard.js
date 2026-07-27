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
  foundWordPaths = [] 
}) 
{
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Back to Categories</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>{selectedCategory.name_en} 🧩</Text>
      <Text style={styles.subtitle}>Selecciona o arrastra para encontrar las palabras:</Text>

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
              const foundObj = foundWordPaths.find(p => p.word === item.english_word);
              const isFound = foundWords.includes(item.english_word);
              return (
                <View style={[
                  styles.wordChip, 
                  isFound && { backgroundColor: 'transparent', borderColor: foundObj?.color || '#10b981', borderWidth: 2 }
                ]}>
                  <Text style={[styles.chipText, isFound && { color: foundObj?.color || '#10b981', fontWeight: 'bold' }]}>
                    {item.english_word} {isFound ? '✓' : ''}
                  </Text>
                </View>
              );
            }}
          />

          {/* Contenedor de la sopa de letras */}
          <View style={styles.gridContainer}>
            {grid.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.gridRow}>
                {row.map((letter, colIndex) => {
                  const isSelected = selectedCells.some(cell => cell.r === rowIndex && cell.c === colIndex);
                  
                  // Buscar si esta celda pertenece a una palabra ya encontrada para darle su color de contorno único
                  const foundPathMatch = foundWordPaths.find(path => 
                    path.cells.some(cell => cell.r === rowIndex && cell.c === colIndex)
                  );

                  return (
                    <TouchableOpacity 
                      key={colIndex} 
                      style={[
                        styles.gridCell, 
                        isSelected && styles.gridCellSelected,
                        foundPathMatch && { 
                          backgroundColor: 'transparent', // Fondo transparente para efecto contorno elegante
                          borderColor: foundPathMatch.color, // Color dinámico individual
                          borderWidth: 2 
                        }
                      ]}
                      onPressIn={() => onCellPress(rowIndex, colIndex, letter)}
                    >
                      <Text style={[
                        styles.cellText, 
                        isSelected && styles.cellTextSelected,
                        foundPathMatch && { color: foundPathMatch.color, fontWeight: 'bold' } // Texto con el mismo color del contorno
                      ]}>
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