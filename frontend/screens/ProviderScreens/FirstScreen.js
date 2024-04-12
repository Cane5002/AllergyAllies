import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const FirstScreen = ({ navigation }) => {
  const [answers, setAnswers] = useState(Array(10).fill(''));

  const handleInputChange = (index, value) => {
    if (!isNaN(value) && value >= 1 && value <= 5) {
      setAnswers(prevAnswers => {
        const newAnswers = [...prevAnswers];
        newAnswers[index] = value;
        return newAnswers;
      });
    }
  };

  const questions = [
    "Question 1: Need to blow nose",
    "Question 2: Sneezing",
    "Question 3: Runny Nose",
    "Question 4: Cough",
    "Question 5: Postnasal discharge (Dripping at the back of your throat)",
    "Question 6: Thick nasal discharge (snot)",
    "Question 7: Ear fullness",
    "Question 8: Dizziness",
    "Question 9: Ear pain",
    "Question 10: Facial Pain",
  ];

  const handleSubmit = () => {
    navigation.navigate('SecondScreen', { answers });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>SNOT SURVEY (Page 1)</Text>
        <View style={styles.card}>
          <Text style={styles.subtitle}>Questions</Text>
          {questions.map((question, index) => (
            <View key={index} style={styles.question}>
              <Text>{question}</Text>
              <Text style={styles.rankText}>Rank From Numbers 1 - 5</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                onChangeText={value => handleInputChange(index, value)}
              />
            </View>
          ))}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    width: '80%',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#063b94',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#063b94',
  },
  question: {
    marginBottom: 10,
  },
  rankText: {
    color: '#888',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#063b94',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default FirstScreen;
