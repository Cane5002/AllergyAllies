import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const SecondScreen = ({ navigation, route }) => {
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
    "Question 11: Difficulty falling asleep",
    "Question 12: Waking up at night",
    "Question 13: Lack of a good night's sleep",
    "Question 14: Waking up tired",
    "Question 15: Fatigue",
    "Question 16: Reduced productivity",
    "Question 17: Reduced concentration",
    "Question 18: Frustrated/restless/irritable",
    "Question 19: Sad",
    "Question 20: Embarrassed",
  ];

  const handleSubmit = () => {
    navigation.navigate('SubmitScreen', { answers });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>SNOT SURVEY (Page 2)</Text>
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
            <Text style={styles.submitButtonText}>Submit</Text>
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

export default SecondScreen;
