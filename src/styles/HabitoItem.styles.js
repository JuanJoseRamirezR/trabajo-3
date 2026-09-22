import { StyleSheet } from 'react-native';
import { colores } from './tema';

export default StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colores.tarjeta,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  itemCompletado: {
    borderColor: colores.exito,
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
    color: colores.texto,
    fontSize: 16,
    fontWeight: '500',
    flexShrink: 1,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  racha: {
    color: colores.acento,
    fontSize: 13,
    marginRight: 10,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colores.exito,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActivo: {
    backgroundColor: colores.exito,
  },
  check: {
    color: colores.fondo,
    fontWeight: 'bold',
  },
});
