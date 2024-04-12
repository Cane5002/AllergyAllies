import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const FirstScreen = ({ navigation }) => {
  const [answers, setAnswers] = useState(Array(10).fill(0));

  const handleSelectOption = (index, value) => {
    setAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  const questions = [
    "Need to blow nose",
    "Sneezing",
    "Runny Nose",
    "Cough",
    "Postnasal discharge (Dripping at the back of your throat)",
    "Thick nasal discharge (Snot)",
    "Ear fullness",
    "Dizziness",
    "Ear pain",
    "Facial Pain",
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
              <Text style={styles.questionText}>{question}</Text>
              <Text style={styles.rankText}>Rank From Numbers 1 - 5</Text>
              <View style={styles.optionsContainer}>
                {[1, 2, 3, 4, 5].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.optionButton, answers[index] === option && styles.selectedOption]}
                    onPress={() => handleSelectOption(index, option)}
                  >
                    <Text>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
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
  questionText: {
    fontSize: 14,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    width: 40,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#063b94',
  },
  submitButton: {
    backgroundColor: '#063b94',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default FirstScreen;
