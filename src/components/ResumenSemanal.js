import React from 'react';
import { View, Text } from 'react-native';
import { DIAS } from '../constants/habitos';
import { fechasDeLaSemana } from '../utils/fecha';
import styles from '../styles/ResumenSemanal.styles';

export default function ResumenSemanal({ historial }) {
  const fechas = fechasDeLaSemana();

  return (
    <View style={styles.resumenCard}>
      <Text style={styles.resumenTitulo}>Resumen{'\n'}Semanal</Text>
      <View style={styles.barrasContenedor}>
        {DIAS.map((letra, i) => {
          const valor = historial[fechas[i]] ?? 0;
          return (
            <View key={i} style={styles.barraColumna}>
              <View style={styles.barraFondoMini}>
                <View style={[styles.barraRellenoMini, { height: `${Math.max(6, valor * 100)}%` }]} />
              </View>
              <Text style={styles.barraLabel}>{letra}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
