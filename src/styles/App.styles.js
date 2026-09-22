import { StyleSheet } from 'react-native';
import { colores } from './tema';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  header: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitulo: {
    color: colores.texto,
    fontSize: 22,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: colores.tarjeta,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  tituloRutina: {
    color: colores.texto,
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitulo: {
    color: colores.textoSecundario,
    fontSize: 14,
    marginBottom: 8,
  },
  progresoTexto: {
    color: colores.textoSecundario,
    fontSize: 14,
    marginBottom: 4,
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  botonAgregar: {
    backgroundColor: colores.exito,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  botonAgregarTexto: {
    color: colores.fondo,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
