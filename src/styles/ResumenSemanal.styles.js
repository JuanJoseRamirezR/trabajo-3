import { StyleSheet } from 'react-native';
import { colores } from './tema';

export default StyleSheet.create({
  resumenCard: {
    flexDirection: 'row',
    backgroundColor: colores.tarjeta,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 16,
  },
  resumenTitulo: {
    color: colores.texto,
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
    backgroundColor: colores.fondo,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barraRellenoMini: {
    width: '100%',
    backgroundColor: colores.exito,
    borderRadius: 6,
  },
  barraLabel: {
    color: colores.textoSecundario,
    fontSize: 11,
    marginTop: 4,
  },
});
