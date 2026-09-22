import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { colores } from '../styles/tema';
import styles from '../styles/ModalNuevoHabito.styles';

export default function ModalNuevoHabito({ visible, onCerrar, onGuardar }) {
  const [nombre, setNombre] = useState('');

  const guardar = () => {
    onGuardar(nombre);
    setNombre('');
  };

  const cancelar = () => {
    setNombre('');
    onCerrar();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.fondo}>
        <View style={styles.caja}>
          <Text style={styles.titulo}>Nuevo hábito</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Dormir 8 horas"
            placeholderTextColor={colores.textoSecundario}
            value={nombre}
            onChangeText={setNombre}
            autoFocus
          />
          <View style={styles.botones}>
            <TouchableOpacity style={styles.botonCancelar} onPress={cancelar}>
              <Text style={styles.botonCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonGuardar} onPress={guardar}>
              <Text style={styles.botonGuardarTexto}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
