import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const SecondScreen = ({ navigation, route }) => {
  const { answers } = route.params;
  const [additionalAnswers, setAdditionalAnswers] = useState(Array(10).fill(0));

  const handleSelectOption = (index, value) => {
    setAdditionalAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  const additionalQuestions = [
    "11. Difficulty falling asleep",
    "12. Waking up at night",
    "13. Lack of a good night's sleep",
    "14. Waking up tired",
    "15. Fatigue",
    "16. Reduced productivity",
    "17. Reduced concentration",
    "18. Frustrated/restless/irritable",
    "19. Sad",
    "20. Embarrassed",
  ];

  const handleSubmit = () => {
    const combinedAnswers = [...answers, ...additionalAnswers];
    navigation.navigate('SubmitScreen', { combinedAnswers });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>SNOT SURVEY (Page 2)</Text>
        <View style={styles.card}>
          <Text style={styles.subtitle}>Questions</Text>
          {additionalQuestions.map((question, index) => (
            <View key={index} style={styles.question}>
              <Text style={styles.questionText}>{question}</Text>
              <Text style={styles.rankText}>Rank From Numbers 1 - 5</Text>
              <View style={styles.optionsContainer}>
                {[1, 2, 3, 4, 5].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.optionButton, additionalAnswers[index] === option && styles.selectedOption]}
                    onPress={() => handleSelectOption(index, option)}
                  >
                    <Text>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
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

export default SecondScreen;
