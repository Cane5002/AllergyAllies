import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SubmitScreen = ({ navigation, route }) => {
  const { answers } = route.params;

  const handleReturnToFirstPage = () => {
    navigation.popToTop();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thank you! Patient information successfully recorded!</Text>
      <TouchableOpacity style={styles.returnButton} onPress={handleReturnToFirstPage}>
        <Text style={styles.returnButtonText}>Finished</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#063b94',
    marginBottom: 20,
  },
  answersContainer: {
    width: '80%',
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  answer: {
    fontSize: 16,
    marginBottom: 10,
  },
  returnButton: {
    backgroundColor: '#063b94',
    paddingVertical: 15,
    paddingHorizontal: 30, 
    borderRadius: 8, 
    marginTop: 20,
  },
  returnButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default SubmitScreen;
