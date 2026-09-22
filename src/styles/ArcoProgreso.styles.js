import { StyleSheet } from 'react-native';
import { colores } from './tema';

export default StyleSheet.create({
  centro: {
    position: 'absolute',
    top: 55,
    alignItems: 'center',
    width: '100%',
  },
  numero: {
    color: colores.texto,
    fontSize: 28,
    fontWeight: 'bold',
  },
  label: {
    color: colores.textoSecundario,
    fontSize: 13,
  },
});
