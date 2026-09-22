import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colores } from '../styles/tema';
import styles from '../styles/ArcoProgreso.styles';

export default function ArcoProgreso({ porcentaje, completados, total }) {
  const size = 180;
  const strokeWidth = 18;
  const radio = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const angInicio = 180;
  const angFin = 180 + 180 * Math.min(1, Math.max(0, porcentaje));

  const puntoEn = (ang) => {
    const rad = (ang * Math.PI) / 180;
    return { x: cx + radio * Math.cos(rad), y: cy + radio * Math.sin(rad) };
  };

  const pInicio = puntoEn(angInicio);
  const pFin = puntoEn(angFin);
  const largeArc = angFin - angInicio > 180 ? 1 : 0;

  const pathFondo = `M ${puntoEn(180).x} ${puntoEn(180).y} A ${radio} ${radio} 0 1 1 ${puntoEn(360).x} ${puntoEn(360).y}`;
  const pathProgreso = `M ${pInicio.x} ${pInicio.y} A ${radio} ${radio} 0 ${largeArc} 1 ${pFin.x} ${pFin.y}`;

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size / 2 + 20}>
        <Path d={pathFondo} stroke={colores.arcoFondo} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
        {porcentaje > 0 && (
          <Path d={pathProgreso} stroke={colores.acento} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
        )}
      </Svg>
      <View style={styles.centro}>
        <Text style={styles.numero}>{completados}/{total}</Text>
        <Text style={styles.label}>completados</Text>
      </View>
    </View>
  );
}
