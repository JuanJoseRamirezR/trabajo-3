import { StyleSheet } from 'react-native';
import { colores } from './tema';

export default StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  caja: {
    backgroundColor: colores.tarjeta,
    borderRadius: 16,
    padding: 20,
    width: '85%',
  },
  titulo: {
    color: colores.texto,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    backgroundColor: colores.fondo,
    color: colores.texto,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  botonCancelar: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  botonCancelarTexto: {
    color: colores.textoSecundario,
    fontSize: 15,
  },
  botonGuardar: {
    backgroundColor: colores.exito,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginLeft: 8,
  },
  botonGuardarTexto: {
    color: colores.fondo,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
