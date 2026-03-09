import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import strings from '../strings';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0a0e14',
  },
  paragraph: {
    fontSize: 15,
    color: '#8899a6',
    lineHeight: 24,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#8899a6',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1a2332',
    borderWidth: 1,
    borderColor: '#38444d',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#e7e9ea',
    marginBottom: 16,
  },
  result: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#1a2332',
    borderRadius: 10,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    color: '#e7e9ea',
  },
  resultNum: {
    fontSize: 22,
    color: '#1d9bf0',
    marginTop: 4,
  },
});

export default function CalcScreen() {
  const [numPoints, setNumPoints] = useState('0');
  const [actionCount, setActionCount] = useState('0');
  const [wildCount, setWildCount] = useState('0');

  const n = parseInt(numPoints, 10) || 0;
  const a = parseInt(actionCount, 10) || 0;
  const w = parseInt(wildCount, 10) || 0;
  const total = n + a * 20 + w * 50;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.paragraph}>{strings.calcIntro}</Text>

      <Text style={styles.label}>{strings.calcLabelNumbers}</Text>
      <TextInput
        style={styles.input}
        value={numPoints}
        onChangeText={setNumPoints}
        keyboardType="number-pad"
        placeholder="0"
        placeholderTextColor="#8899a6"
      />

      <Text style={styles.label}>{strings.calcLabelAction}</Text>
      <TextInput
        style={styles.input}
        value={actionCount}
        onChangeText={setActionCount}
        keyboardType="number-pad"
        placeholder="0"
        placeholderTextColor="#8899a6"
      />

      <Text style={styles.label}>{strings.calcLabelWild}</Text>
      <TextInput
        style={styles.input}
        value={wildCount}
        onChangeText={setWildCount}
        keyboardType="number-pad"
        placeholder="0"
        placeholderTextColor="#8899a6"
      />

      <View style={styles.result}>
        <Text style={styles.resultText}>{strings.calcTotal}</Text>
        <Text style={styles.resultNum}>{total} {strings.calcPoints}</Text>
      </View>
    </SafeAreaView>
  );
}
