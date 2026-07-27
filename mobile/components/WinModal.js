import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { styles } from '../styles';

export default function WinModal({ visible, time, onPlayAgain }) {
  
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContent}>
          <Text style={modalStyles.emoji}>🎉</Text>
          <Text style={styles.title}>Congratulations!</Text>
          <Text style={styles.subtitle}>You've found all the words.</Text>
          
          <View style={modalStyles.statsContainer}>
            <Text style={modalStyles.statsText}>Time: ⏱️ {formatTime(time)}</Text>
          </View>

          <TouchableOpacity style={modalStyles.button} onPress={onPlayAgain}>
            <Text style={modalStyles.buttonText}>Back to Categories</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
    elevation: 5,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  statsContainer: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 15,
  },
  statsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});