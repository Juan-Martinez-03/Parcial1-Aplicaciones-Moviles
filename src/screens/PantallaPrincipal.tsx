import { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ModalAgregar from "../components/ModalAgregar";
import { usarAutenticacion } from "../context/ContextoAutenticacion";

import * as Calendar from "expo-calendar/legacy";
import * as Contacts from "expo-contacts/legacy";
import * as Location from "expo-location";

import { useDispatch, useSelector } from "react-redux";
import {
  agregarProducto,
  asignarContacto,
  borrarProducto,
  limpiarProductos,
  Producto,
} from "../redux/slices/comprasSlice";
import { RootState } from "../redux/store";

export default function PantallaPrincipal({ navigation }: any) {
  const { salirDelSistema } = usarAutenticacion();
  const [modalAbierto, setModalAbierto] = useState(false);

  const dispatch = useDispatch();
  const listaDeProductos = useSelector(
    (state: RootState) => state.compras.listaDeProductos,
  );

  const apretarBotonSalir = async () => {
    dispatch(limpiarProductos());
    await salirDelSistema();
  };

  const agendarEnCalendario = async (nombreDeLoQueCompre: string) => {
    if (Platform.OS === "web") return;

    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Aviso", "No diste permiso para usar el calendario.");
        return;
      }

      const calendarios = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT,
      );
      const editables = calendarios.filter((c) => c.allowsModifications);

      if (editables.length === 0) return;

      const calendarioElegido =
        editables.find((c) => c.isPrimary) ||
        editables.find((c) => c.source?.name?.includes("@gmail")) ||
        editables[0];

      const idCalendario = calendarioElegido.id;

      const fechaInicio = new Date();
      fechaInicio.setMinutes(fechaInicio.getMinutes() + 1);

      const fechaFin = new Date(fechaInicio);
      fechaFin.setMinutes(fechaFin.getMinutes() + 30);

      await Calendar.createEventAsync(idCalendario, {
        title: `🛒 Comprar: ${nombreDeLoQueCompre}`,
        startDate: fechaInicio,
        endDate: fechaFin,
        notes: "Agregado por la app",
        timeZone: "America/Argentina/Buenos_Aires",
        alarms: [{ relativeOffset: 0, method: Calendar.AlarmMethod.DEFAULT }],
      });

      const nombreCal = calendarioElegido.title || calendarioElegido.name;

      Alert.alert(
        "¡Agendado exitosamente!",
        `El producto se guardó en tu calendario.`,
        [
          { text: "OK", style: "cancel" },
          {
            text: "Abrir Calendario",
            onPress: () => {
              if (Platform.OS === "ios") {
                Linking.openURL("calshow://");
              } else {
                Linking.openURL("content://com.android.calendar/time/");
              }
            },
          },
        ],
      );
    } catch (error) {
      console.log("Error al agendar:", error);
      Alert.alert(
        "Error",
        "Hubo un problema y no se pudo guardar en el calendario.",
      );
    }
  };

  const finalizarGuardado = async (
    texto: string,
    foto?: string,
    ubi: string = "",
  ) => {
    const nuevoProducto: Producto = {
      idUnico: Date.now().toString(),
      nombreDelProducto: texto,
      fotoURI: foto,
      ubicacion: ubi,
    };
    dispatch(agregarProducto(nuevoProducto));
    await agendarEnCalendario(texto);
  };

  const funcionCuandoGuardoEnModal = async (
    textoEscrito: string,
    fotoURI?: string,
  ) => {
    if (Platform.OS !== "web") {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "Ubicación obligatoria",
            "Tenés que habilitar el GPS para poder guardar el producto. Si no, no funciona.",
            [
              { text: "Cancelar", style: "cancel" },
              { text: "Abrir Ajustes", onPress: () => Linking.openSettings() },
            ],
          );
          return;
        }

        const ubicacionActual = await Location.getCurrentPositionAsync({});
        const ubicacionCapturada = `Lat: ${ubicacionActual.coords.latitude.toFixed(4)}, Lon: ${ubicacionActual.coords.longitude.toFixed(4)}`;
        await finalizarGuardado(textoEscrito, fotoURI, ubicacionCapturada);
      } catch (error) {
        console.log("Error de ubicación:", error);
        Alert.alert(
          "Error de GPS",
          "No se pudo obtener la ubicación. Revisá que el GPS de tu celular esté encendido para poder guardar.",
        );
        return;
      }
    } else {
      await finalizarGuardado(textoEscrito, fotoURI, "");
    }
  };

  const buscarContactoParaProducto = async (idProducto: string) => {
    if (Platform.OS === "web") {
      Alert.alert(
        "Aviso",
        "Los contactos solo funcionan en el celular físico.",
      );
      return;
    }

    try {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Rechazaste el acceso a los contactos. Para usar esta función, tenés que habilitarlo manualmente desde la configuración.",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Abrir Ajustes", onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }

      const contactoElegido = await Contacts.presentContactPickerAsync();

      if (contactoElegido) {
        const nombreDelContacto = contactoElegido.name || "Contacto sin nombre";
        dispatch(
          asignarContacto({
            id: idProducto,
            nombreContacto: nombreDelContacto,
          }),
        );
        Alert.alert(
          "¡Contacto asignado!",
          `Producto encargado a: ${nombreDelContacto}`,
        );
      }
    } catch (error) {
      console.log("Error de Contactos:", error);
      Alert.alert("Error", "Hubo un problema al intentar abrir los contactos.");
    }
  };

  const dibujarRenglonDeLista = ({ item }: { item: Producto }) => (
    <View style={estilos.renglonBlanco}>
      {item.fotoURI ? (
        <Image source={{ uri: item.fotoURI }} style={estilos.fotoMiniatura} />
      ) : (
        <View style={estilos.espacioSinFoto} />
      )}

      <View style={estilos.contenedorTextoProducto}>
        <Text style={estilos.textoProducto}>{item.nombreDelProducto}</Text>
        {item.ubicacion ? (
          <Text style={estilos.textoSecundario}>📍 {item.ubicacion}</Text>
        ) : null}
        {item.contacto ? (
          <Text style={estilos.textoSecundario}>
            👤 Proveedor: {item.contacto}
          </Text>
        ) : null}
      </View>

      <View style={estilos.contenedorBotones}>
        <TouchableOpacity
          onPress={() => buscarContactoParaProducto(item.idUnico)}
          style={estilos.botonAzulChico}
          activeOpacity={0.8}
        >
          <Text style={estilos.iconoBoton}>👤</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => dispatch(borrarProducto(item.idUnico))}
          style={estilos.botonRojoChico}
          activeOpacity={0.8}
        >
          <Text style={estilos.iconoBoton}>X</Text>
        </TouchableOpacity>
      </View>
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
  textoBloque: { color: "white", fontWeight: "bold", fontSize: 16 },
  margenesDeLista: { padding: 20 },

  renglonBlanco: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    overflow: "hidden",
    alignItems: "center",
  },
  fotoMiniatura: {
    width: 60,
    height: 60,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  espacioSinFoto: { width: 15 },
  contenedorTextoProducto: { flex: 1, padding: 16, justifyContent: "center" },
  textoProducto: { fontSize: 16, color: "#1e293b", fontWeight: "600" },
  textoSecundario: { fontSize: 12, color: "#64748b", marginTop: 4 },

  contenedorBotones: { flexDirection: "row", height: "100%" },
  botonAzulChico: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  botonRojoChico: {
    backgroundColor: "#e11d48",
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  iconoBoton: { color: "white", fontWeight: "bold", fontSize: 16 },

  textoVacio: {
    textAlign: "center",
    marginTop: 50,
    color: "#6b7e98",
    fontSize: 16,
  },
});
