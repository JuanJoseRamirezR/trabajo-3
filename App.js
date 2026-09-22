import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg';

const STORAGE_KEY = '@habitos_diarios_v2';
const HISTORIAL_KEY = '@habitos_historial_v2';

const HABITOS_INICIALES = [
  { id: '1', nombre: 'Leer', icono: '📖', racha: 12, completado: false },
  { id: '2', nombre: 'Hidratación', icono: '💧', racha: 25, completado: false },
  { id: '3', nombre: 'Meditar', icono: '🧘', racha: 8, completado: false },
  { id: '4', nombre: 'Ejercicio', icono: '💪', racha: 20, completado: false },
  { id: '5', nombre: 'Escribir', icono: '✍️', racha: 5, completado: false },
];

const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

function ArcoProgreso({ porcentaje, completados, total }) {
  const size = 180;
  const strokeWidth = 18;
  const radio = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const angInicio = 180;
  const angFin = 180 + 180 * Math.min(1, Math.max(0, porcentaje));

  const puntoEn = (ang) => {
    const rad = (ang * Math.PI) / 180;
    return {
      x: cx + radio * Math.cos(rad),
      y: cy + radio * Math.sin(rad),
    };
  };

  const pInicio = puntoEn(angInicio);
  const pFin = puntoEn(angFin);
  const largeArc = angFin - angInicio > 180 ? 1 : 0;

  const pathFondo = `M ${puntoEn(180).x} ${puntoEn(180).y} A ${radio} ${radio} 0 1 1 ${puntoEn(360).x} ${puntoEn(360).y}`;
  const pathProgreso = `M ${pInicio.x} ${pInicio.y} A ${radio} ${radio} 0 ${largeArc} 1 ${pFin.x} ${pFin.y}`;

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size / 2 + 20}>
        <Path
          d={pathFondo}
          stroke="#e8e2f7"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        {porcentaje > 0 && (
          <Path
            d={pathProgreso}
            stroke="#ff7a59"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        )}
      </Svg>
      <View style={styles.arcoCentro}>
        <Text style={styles.arcoNumero}>
          {completados}/{total}
        </Text>
        <Text style={styles.arcoLabel}>completados</Text>
      </View>
    </View>
  );
}

export default function App() {
  const [habitos, setHabitos] = useState([]);
  const [historial, setHistorial] = useState({});
  const [cargando, setCargando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');

  useEffect(() => {
    cargarTodo();
  }, []);

  useEffect(() => {
    if (!cargando) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habitos)).catch(() => {});
    }
  }, [habitos]);

  useEffect(() => {
    if (!cargando) {
      AsyncStorage.setItem(HISTORIAL_KEY, JSON.stringify(historial)).catch(() => {});
    }
  }, [historial]);

  const cargarTodo = async () => {
    try {
      const dataHabitos = await AsyncStorage.getItem(STORAGE_KEY);
      const dataHistorial = await AsyncStorage.getItem(HISTORIAL_KEY);

      let listaHabitos = HABITOS_INICIALES;
      if (dataHabitos !== null) {
        const guardados = JSON.parse(dataHabitos);
        listaHabitos = guardados.map((h) => ({
          id: String(h.id ?? Date.now()),
          nombre: typeof h.nombre === 'string' ? h.nombre : 'Hábito',
          icono: typeof h.icono === 'string' ? h.icono : '⭐',
          racha: typeof h.racha === 'number' && !isNaN(h.racha) ? h.racha : 0,
          completado: !!h.completado,
        }));
      }

      const hist = dataHistorial !== null ? JSON.parse(dataHistorial) : {};
      setHistorial(hist);
      setHabitos(listaHabitos);
    } catch (e) {
      setHabitos(HABITOS_INICIALES);
      setHistorial({});
    } finally {
      setCargando(false);
    }
  };

  const guardarProgresoHoy = (listaActualizada) => {
    const completados = listaActualizada.filter((h) => h.completado).length;
    const total = listaActualizada.length;
    const pct = total > 0 ? completados / total : 0;
    setHistorial((prev) => ({ ...prev, [hoyISO()]: pct }));
  };

  const toggleHabito = (id) => {
    setHabitos((prev) => {
      const actualizada = prev.map((h) =>
        h.id === id
          ? {
              ...h,
              completado: !h.completado,
              racha: !h.completado ? h.racha + 1 : Math.max(0, h.racha - 1),
            }
          : h
      );
      guardarProgresoHoy(actualizada);
      return actualizada;
    });
  };

  const agregarHabito = () => {
    const nombre = nuevoNombre.trim();
    if (!nombre) return;
    const nuevo = {
      id: String(Date.now()),
      nombre,
      icono: '⭐',
      racha: 0,
      completado: false,
    };
    setHabitos((prev) => [...prev, nuevo]);
    setNuevoNombre('');
    setModalVisible(false);
  };

  const completados = habitos.filter((h) => h.completado).length;
  const total = habitos.length;
  const porcentaje = total > 0 ? completados / total : 0;

  const barrasSemana = () => {
    const hoy = new Date();
    const diaSemana = (hoy.getDay() + 6) % 7; // 0 = lunes
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - diaSemana);

    return DIAS.map((letra, i) => {
      const fecha = new Date(lunes);
      fecha.setDate(lunes.getDate() + i);
      const iso = fecha.toISOString().slice(0, 10);
      const valor = historial[iso] ?? 0;
      return { letra, valor };
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, item.completado && styles.itemCompletado]}
      onPress={() => toggleHabito(item.id)}
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f2027" />

      <View style={styles.header}>
        <Text style={styles.headerTitulo}>📚 Hábitos Diarios</Text>
      </View>

      <FlatList
        data={habitos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.card}>
              <Text style={styles.tituloRutina}>Mi Rutina</Text>
              <Text style={styles.subtitulo}>¡Mantente constante!</Text>
              <Text style={styles.progresoTexto}>
                Progreso de Hoy: {Math.round(porcentaje * 100)}%
              </Text>
              <ArcoProgreso
                porcentaje={porcentaje}
                completados={completados}
                total={total}
              />
            </View>
          </>
        }
        ListFooterComponent={
          <>
            <View style={styles.resumenCard}>
              <Text style={styles.resumenTitulo}>Resumen{'\n'}Semanal</Text>
              <View style={styles.barrasContenedor}>
                {barrasSemana().map((d, i) => (
                  <View key={i} style={styles.barraColumna}>
                    <View style={styles.barraFondoMini}>
                      <View
                        style={[
                          styles.barraRellenoMini,
                          { height: `${Math.max(6, d.valor * 100)}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.barraLabel}>{d.letra}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.botonAgregar}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.botonAgregarTexto}>AGREGAR NUEVO HÁBITO  ＋</Text>
            </TouchableOpacity>
          </>
        }
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalFondo}>
          <View style={styles.modalCaja}>
            <Text style={styles.modalTitulo}>Nuevo hábito</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ej: Dormir 8 horas"
              placeholderTextColor="#7a8a94"
              value={nuevoNombre}
              onChangeText={setNuevoNombre}
              autoFocus
            />
            <View style={styles.modalBotones}>
              <TouchableOpacity
                style={styles.modalBotonCancelar}
                onPress={() => {
                  setModalVisible(false);
                  setNuevoNombre('');
                }}
              >
                <Text style={styles.modalBotonCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBotonGuardar} onPress={agregarHabito}>
                <Text style={styles.modalBotonGuardarTexto}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f5fb',
  },
  header: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitulo: {
    color: '#3d2c5c',
    fontSize: 22,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#3d2c5c',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  tituloRutina: {
    color: '#3d2c5c',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitulo: {
    color: '#9b8fb5',
    fontSize: 14,
    marginBottom: 8,
  },
  progresoTexto: {
    color: '#6b5c8c',
    fontSize: 14,
    marginBottom: 4,
  },
  arcoCentro: {
    position: 'absolute',
    top: 55,
    alignItems: 'center',
    width: '100%',
  },
  arcoNumero: {
    color: '#3d2c5c',
    fontSize: 28,
    fontWeight: 'bold',
  },
  arcoLabel: {
    color: '#9b8fb5',
    fontSize: 13,
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#3d2c5c',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  itemCompletado: {
    borderColor: '#ff7a59',
    backgroundColor: '#fff2ee',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  icono: {
    fontSize: 20,
    marginRight: 10,
  },
  nombreHabito: {
    color: '#3d2c5c',
    fontSize: 16,
    fontWeight: '500',
    flexShrink: 1,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  racha: {
    color: '#ff9a3d',
    fontSize: 13,
    marginRight: 10,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#ff7a59',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActivo: {
    backgroundColor: '#ff7a59',
  },
  check: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  resumenCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 16,
    shadowColor: '#3d2c5c',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  resumenTitulo: {
    color: '#3d2c5c',
    fontSize: 15,
    fontWeight: '600',
  },
  barrasContenedor: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  barraColumna: {
    alignItems: 'center',
    marginLeft: 8,
  },
  barraFondoMini: {
    width: 14,
    height: 44,
    backgroundColor: '#f0ecf8',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barraRellenoMini: {
    width: '100%',
    backgroundColor: '#ff7a59',
    borderRadius: 6,
  },
  barraLabel: {
    color: '#9b8fb5',
    fontSize: 11,
    marginTop: 4,
  },
  botonAgregar: {
    backgroundColor: '#ff7a59',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#ff7a59',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  botonAgregarTexto: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalFondo: {
    flex: 1,
    backgroundColor: 'rgba(61,44,92,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCaja: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '85%',
  },
  modalTitulo: {
    color: '#3d2c5c',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: '#f7f5fb',
    color: '#3d2c5c',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  modalBotones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalBotonCancelar: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalBotonCancelarTexto: {
    color: '#9b8fb5',
    fontSize: 15,
  },
  modalBotonGuardar: {
    backgroundColor: '#ff7a59',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginLeft: 8,
  },
  modalBotonGuardarTexto: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});