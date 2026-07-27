import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView, Platform} from 'react-native';
import { styles } from '../styles';

// Main Category View
export default function CategoryList({ categories, onSelectCategory }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>LexiHunt</Text>
      <Text style={styles.subtitle}>Select a category to play</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onSelectCategory(item)}>
            <Text style={styles.cardTitle}>{item.name_en}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}