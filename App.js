import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';

import useHabitos from './src/hooks/useHabitos';
import ArcoProgreso from './src/components/ArcoProgreso';
import HabitoItem from './src/components/HabitoItem';
import ResumenSemanal from './src/components/ResumenSemanal';
import ModalNuevoHabito from './src/components/ModalNuevoHabito';
import { colores } from './src/styles/tema';
import styles from './src/styles/App.styles';

export default function App() {
  const { habitos, historial, completados, total, porcentaje, toggleHabito, agregarHabito } = useHabitos();
  const [modalVisible, setModalVisible] = useState(false);

  const handleGuardarHabito = (nombre) => {
    agregarHabito(nombre);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colores.fondo} />

      <View style={styles.header}>
        <Text style={styles.headerTitulo}>📚 Hábitos Diarios</Text>
      </View>

      <FlatList
        data={habitos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HabitoItem item={item} onToggle={toggleHabito} />}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.card}>
            <Text style={styles.tituloRutina}>Mi Rutina</Text>
            <Text style={styles.subtitulo}>¡Mantente constante!</Text>
            <Text style={styles.progresoTexto}>Progreso de Hoy: {Math.round(porcentaje * 100)}%</Text>
            <ArcoProgreso porcentaje={porcentaje} completados={completados} total={total} />
          </View>
        }
        ListFooterComponent={
          <>
            <ResumenSemanal historial={historial} />
            <TouchableOpacity style={styles.botonAgregar} onPress={() => setModalVisible(true)}>
              <Text style={styles.botonAgregarTexto}>AGREGAR NUEVO HÁBITO  ＋</Text>
            </TouchableOpacity>
          </>
        }
      />

      <ModalNuevoHabito
        visible={modalVisible}
        onCerrar={() => setModalVisible(false)}
        onGuardar={handleGuardarHabito}
      />
    </SafeAreaView>
  );
}
