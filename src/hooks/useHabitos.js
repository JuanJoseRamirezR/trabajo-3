import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  STORAGE_KEY,
  HISTORIAL_KEY,
  HABITOS_INICIALES,
} from '../constants/habitos';
import { hoyISO } from '../utils/fecha';

export default function useHabitos() {
  const [habitos, setHabitos] = useState([]);
  const [historial, setHistorial] = useState({});
  const [cargando, setCargando] = useState(true);

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

      setHistorial(dataHistorial !== null ? JSON.parse(dataHistorial) : {});
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

  const agregarHabito = (nombre) => {
    const limpio = nombre.trim();
    if (!limpio) return;
    setHabitos((prev) => [
      ...prev,
      { id: String(Date.now()), nombre: limpio, icono: '⭐', racha: 0, completado: false },
    ]);
  };

  const completados = habitos.filter((h) => h.completado).length;
  const total = habitos.length;
  const porcentaje = total > 0 ? completados / total : 0;

  return {
    habitos,
    historial,
    completados,
    total,
    porcentaje,
    toggleHabito,
    agregarHabito,
  };
}
