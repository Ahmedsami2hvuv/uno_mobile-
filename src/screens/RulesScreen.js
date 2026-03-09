import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import strings from '../strings';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0a0e14',
  },
  heading: {
    fontSize: 20,
    color: '#e7e9ea',
    marginBottom: 12,
  },
  subheading: {
    fontSize: 17,
    color: '#e7e9ea',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    color: '#8899a6',
    lineHeight: 24,
    marginBottom: 12,
  },
  bullet: {
    fontSize: 15,
    color: '#8899a6',
    lineHeight: 24,
    marginBottom: 6,
    paddingRight: 8,
  },
});

// إزالة تنسيق ماركداون ** للنص العادي
function plain(s) {
  return (s || '').replace(/\*\*/g, '');
}

export default function RulesScreen() {
  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.heading}>{strings.rulesTitle}</Text>
      <Text style={styles.paragraph}>{plain(strings.trainingContent)}</Text>
    </ScrollView>
    </SafeAreaView>
  );
}
