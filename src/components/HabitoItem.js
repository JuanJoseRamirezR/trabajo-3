import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/HabitoItem.styles';

export default function HabitoItem({ item, onToggle }) {
  return (
    <TouchableOpacity
      style={[styles.item, item.completado && styles.itemCompletado]}
      onPress={() => onToggle(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.itemLeft}>
        <Text style={styles.icono}>{item.icono}</Text>
        <Text style={styles.nombreHabito}>{item.nombre}</Text>
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.racha}>🔥 {item.racha} días</Text>
        <View style={[styles.checkbox, item.completado && styles.checkboxActivo]}>
          {item.completado && <Text style={styles.check}>✓</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}
