import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Propiedades {
  esVisible: boolean;
  funcionParaCerrar: () => void;
  funcionParaGuardar: (textoEscrito: string) => void;
}

export default function ModalAgregar({
  esVisible,
  funcionParaCerrar,
  funcionParaGuardar,
}: Propiedades) {
  const [textoIngresado, setTextoIngresado] = useState("");

  const botonGuardarApretado = () => {
    if (textoIngresado.trim()) {
      funcionParaGuardar(textoIngresado);
      setTextoIngresado("");
      funcionParaCerrar();
    }
  };

  return (
    <Modal visible={esVisible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={estilos.fondoOscuro}
      >
        <TouchableOpacity
          style={estilos.areaCierre}
          activeOpacity={1}
          onPress={funcionParaCerrar}
        />

        <View style={estilos.cajaInferior}>
          <View style={estilos.indicadorArrastre}></View>

          <Text style={estilos.titulo}>Agregar productos</Text>

          <TextInput
            style={estilos.cajaDeTexto}
            placeholder="Ej: Yerba, Café, Galletitas..."
            placeholderTextColor="#94a3b8"
            value={textoIngresado}
            onChangeText={setTextoIngresado}
            autoFocus
          />

          <View style={estilos.filaBotones}>
            <TouchableOpacity
              onPress={funcionParaCerrar}
              style={[estilos.botonGeneral, estilos.botonCancelar]}
            >
              <Text style={estilos.textoOscuro}>Volver</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={botonGuardarApretado}
              style={[estilos.botonGeneral, estilos.botonGuardar]}
            >
              <Text style={estilos.textoBlanco}>Sumar al carrito</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fondoOscuro: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  areaCierre: {
    flex: 1,
  },
  cajaInferior: {
    backgroundColor: "white",
    padding: 25,
    paddingBottom: 40,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  indicadorArrastre: {
    width: 45,
    height: 5,
    backgroundColor: "#cbd5e1",
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 20,
    textAlign: "center",
  },
  cajaDeTexto: {
    backgroundColor: "#f1f5f9",
    borderRadius: 15,
    padding: 18,
    fontSize: 16,
    color: "#334155",
    marginBottom: 25,
  },
  filaBotones: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  botonGeneral: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
  },
  botonCancelar: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  botonGuardar: {
    backgroundColor: "#1a0eff",
  },
  textoOscuro: {
    fontWeight: "700",
    color: "#8db5ec",
    fontSize: 15,
  },
  textoBlanco: {
    fontWeight: "700",
    color: "white",
    fontSize: 15,
  },
});
