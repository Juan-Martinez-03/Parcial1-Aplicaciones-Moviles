import { useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ModalAgregar from "../components/ModalAgregar";
import { usarAutenticacion } from "../context/ContextoAutenticacion";
import { Producto, usarListaCompras } from "../hooks/usarListaCompras";

export default function PantallaPrincipal({ navigation }: any) {
  const { salirDelSistema } = usarAutenticacion();
  const { listaDeProductos, agregarNuevoProducto, borrarProducto } =
    usarListaCompras();
  const [modalAbierto, setModalAbierto] = useState(false);

  const apretarBotonSalir = async () => {
    await salirDelSistema();
  };

  const programarAviso = (nombreDeLoQueCompre: string) => {
    setTimeout(() => {
      if (Platform.OS === "web") {
        window.alert(
          `notificación:\ncomprar ${nombreDeLoQueCompre} en el súper`,
        );
      } else {
        Alert.alert("notificación", `comprar: ${nombreDeLoQueCompre}`, [
          { text: "Entendido" },
        ]);
      }
    }, 1000);
  };

  const funcionCuandoGuardoEnModal = async (textoEscrito: string) => {
    await agregarNuevoProducto(textoEscrito);
    programarAviso(textoEscrito);
  };

  const dibujarRenglonDeLista = ({ item }: { item: Producto }) => (
    <View style={estilos.renglonBlanco}>
      <View style={estilos.contenedorTextoProducto}>
        <Text style={estilos.textoProducto}>:::: {item.nombreDelProducto}</Text>
      </View>

      <TouchableOpacity
        onPress={() => borrarProducto(item.idUnico)}
        style={estilos.botonRojoChico}
        activeOpacity={0.8}
      >
        <Text style={estilos.cruzRoja}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={estilos.fondoGeneral}>
      <View style={estilos.techoSuperior}>
        <Text style={estilos.tituloPrincipal}>🛍️ Mis compras</Text>
      </View>

      <TouchableOpacity
        onPress={apretarBotonSalir}
        style={estilos.bloqueRojo}
        activeOpacity={0.8}
      >
        <Text style={estilos.textoBloque}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setModalAbierto(true)}
        style={estilos.bloqueVerde}
        activeOpacity={0.8}
      >
        <Text style={estilos.textoBloque}>Agregá productos</Text>
      </TouchableOpacity>

      <FlatList
        data={listaDeProductos}
        keyExtractor={(item) => item.idUnico}
        renderItem={dibujarRenglonDeLista}
        contentContainerStyle={estilos.margenesDeLista}
        ListEmptyComponent={
          <Text style={estilos.textoVacio}>No hay productos en la lista</Text>
        }
      />

      <ModalAgregar
        esVisible={modalAbierto}
        funcionParaCerrar={() => setModalAbierto(false)}
        funcionParaGuardar={funcionCuandoGuardoEnModal}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  fondoGeneral: { flex: 1, backgroundColor: "#f1f5f9" },
  techoSuperior: {
    padding: 20,
    backgroundColor: "white",
    elevation: 2,
    alignItems: "center",
  },
  tituloPrincipal: { fontSize: 20, fontWeight: "bold", color: "#1e293b" },
  bloqueRojo: {
    backgroundColor: "#e11d48",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  bloqueVerde: {
    backgroundColor: "#10b981",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  textoBloque: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  margenesDeLista: { padding: 20 },

  renglonBlanco: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    overflow: "hidden",
  },
  contenedorTextoProducto: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  textoProducto: { fontSize: 15, color: "#1e293b", fontWeight: "500" },
  botonRojoChico: {
    backgroundColor: "#e11d48",
    paddingHorizontal: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  cruzRoja: { color: "white", fontWeight: "bold", fontSize: 20 },

  textoVacio: {
    textAlign: "center",
    marginTop: 50,
    color: "#6b7e98",
    fontSize: 16,
  },
});
