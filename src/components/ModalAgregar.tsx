import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface PropsModal {
  esVisible: boolean;
  funcionParaCerrar: () => void;
  funcionParaGuardar: (nombre: string, foto?: string) => void;
}

export default function ModalAgregar({
  esVisible,
  funcionParaCerrar,
  funcionParaGuardar,
}: PropsModal) {
  const [nombreProducto, setNombreProducto] = useState("");
  const [fotoTemporal, setFotoTemporal] = useState<string | undefined>(
    undefined,
  );

  const sacarFotoConCamara = async () => {
    const permisos = await ImagePicker.requestCameraPermissionsAsync();

    if (!permisos.granted) {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos permiso para usar la cámara.",
      );
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!resultado.canceled) {
      setFotoTemporal(resultado.assets[0].uri);
    }
  };

  const elegirFotoDeGaleria = async () => {
    const permisos = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permisos.granted) {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos permiso para ver tus fotos.",
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!resultado.canceled) {
      setFotoTemporal(resultado.assets[0].uri);
    }
  };

  const apretarGuardar = () => {
    if (nombreProducto.trim() === "") {
      Alert.alert("Error", "El nombre del producto no puede estar vacío.");
      return;
    }

    funcionParaGuardar(nombreProducto, fotoTemporal);

    setNombreProducto("");
    setFotoTemporal(undefined);
    funcionParaCerrar();
  };

  const apretarCancelar = () => {
    setNombreProducto("");
    setFotoTemporal(undefined);
    funcionParaCerrar();
  };

  return (
    <Modal visible={esVisible} animationType="slide" transparent={true}>
      <View style={estilos.fondoOscuro}>
        <View style={estilos.cajaBlanca}>
          <Text style={estilos.titulo}>Nuevo Producto</Text>

          <TextInput
            style={estilos.input}
            placeholder="Ej: Fideos, Yerba..."
            value={nombreProducto}
            onChangeText={setNombreProducto}
          />

          <View style={estilos.cajaBotonesFoto}>
            <TouchableOpacity
              onPress={sacarFotoConCamara}
              style={estilos.botonFotoCamara}
              activeOpacity={0.8}
            >
              <Text style={estilos.textoBotonFoto}>📷 Cámara</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={elegirFotoDeGaleria}
              style={estilos.botonFotoGaleria}
              activeOpacity={0.8}
            >
              <Text style={estilos.textoBotonFoto}>🖼️ Galería</Text>
            </TouchableOpacity>
          </View>

          {fotoTemporal && (
            <Image
              source={{ uri: fotoTemporal }}
              style={estilos.vistaPreviaFoto}
            />
          )}

          <View style={estilos.cajaBotonesAccion}>
            <TouchableOpacity
              onPress={apretarCancelar}
              style={estilos.botonCancelar}
              activeOpacity={0.8}
            >
              <Text style={estilos.textoBotonAccion}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={apretarGuardar}
              style={estilos.botonGuardar}
              activeOpacity={0.8}
            >
              <Text style={estilos.textoBotonAccion}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fondoOscuro: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  cajaBlanca: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  cajaBotonesFoto: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  botonFotoCamara: {
    flex: 1,
    backgroundColor: "#0284c7",
    padding: 12,
    borderRadius: 8,
    marginRight: 5,
    alignItems: "center",
  },
  botonFotoGaleria: {
    flex: 1,
    backgroundColor: "#64748b",
    padding: 12,
    borderRadius: 8,
    marginLeft: 5,
    alignItems: "center",
  },
  textoBotonFoto: { color: "white", fontWeight: "bold", fontSize: 14 },
  vistaPreviaFoto: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 20,
    resizeMode: "cover",
  },
  cajaBotonesAccion: { flexDirection: "row", justifyContent: "space-between" },
  botonCancelar: {
    flex: 1,
    padding: 15,
    backgroundColor: "#ef4444",
    borderRadius: 8,
    marginRight: 5,
    alignItems: "center",
  },
  botonGuardar: {
    flex: 1,
    padding: 15,
    backgroundColor: "#10b981",
    borderRadius: 8,
    marginLeft: 5,
    alignItems: "center",
  },
  textoBotonAccion: { color: "white", fontWeight: "bold", fontSize: 16 },
});
