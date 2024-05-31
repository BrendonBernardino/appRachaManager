import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  const [pix, setPix] = useState<number>(0.00);
  const [dinheiro, setDinheiro] = useState<number>(0.00);
  const [total, setTotal] = useState<number>(0.00);
  const [restante, setRestante] = useState<number>(0.00);
  const [parcelaPraCada, setParcelaPraCadaRestante] = useState<number>(0.00);

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.topModule}>
        <ThemedText type="title" style={styles.title}>Financeiro</ThemedText>
      </ThemedView>
      <ThemedText type="subtitle" style={styles.subtitle}>Pagamento Campo</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>R$140,00</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>Restante:</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>R$20,00</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>Pix:</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>R$20,00</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>Dinheiro:</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>R$20,00</ThemedText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A291A",
  },
  topModule: {
    flex: 0.23,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#191A19',
    width:'100%',
  },
  botModule: {
    flex: 1,
    // width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    // paddingTop: 20,
    // paddingLeft: 20,
    backgroundColor: '#1A291A',
  },
  title: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 70,
    color: '#4E9F3D',
    fontSize: 50,
    // backgroundColor:'pink',
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#FFFFFF',
  },
});
