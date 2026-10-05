import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usarAutenticacion } from "../context/ContextoAutenticacion";
import { validateLoginInput } from "../utils/validadores";

export default function PantallaLogin({ navigation }: any) {
  const { registrarNuevoUsuario, entrarAlSistema } = usarAutenticacion();
  const [correoEscrito, setCorreoEscrito] = useState("");
  const [claveEscrita, setClaveEscrita] = useState("");
  const [estamosEnRegistro, setEstamosEnRegistro] = useState(false);
  const [listaErrores, setListaErrores] = useState<string[]>([]);
  const [mensajeExito, setMensajeExito] = useState("");

  const botonPrincipalApretado = async () => {
    setMensajeExito("");

    const fallosEncontrados = validateLoginInput(correoEscrito, claveEscrita);

    if (fallosEncontrados.length > 0) {
      setListaErrores(fallosEncontrados);
      return;
    }
    setListaErrores([]);

    if (estamosEnRegistro) {
      const registroOk = await registrarNuevoUsuario(
        correoEscrito,
        claveEscrita,
      );

      if (registroOk) {
        setMensajeExito("Cuenta creada con éxito");
        setEstamosEnRegistro(false);
      } else {
        setListaErrores(["El correo ya se encuentra registrado."]);
      }
    } else {
      const resultadoLogin = await entrarAlSistema(correoEscrito, claveEscrita);

      if (!resultadoLogin.exito) {
        setListaErrores([
          resultadoLogin.mensajeError || "Correo o contraseña incorrectos.",
        ]);
      }
    }
  };

  return (
    <SafeAreaView style={styles.contenedorPrincipal}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.tecladoAjuste}
      >
        <View style={styles.tarjetaLogin}>
          <View style={styles.contenedorTitulo}>
            <Text style={styles.tituloPrincipal}>
              {estamosEnRegistro ? "👤 Registrate " : "🛍️ Tienda "}
            </Text>
          </View>

          {listaErrores.map((error, index) => (
            <View key={index} style={styles.cajaError}>
              <Text style={styles.textoError}>⚠️ {error}</Text>
            </View>
          ))}

          {mensajeExito ? (
            <View style={styles.cajaExito}>
              <Text style={styles.textoExito}>✨ {mensajeExito}</Text>
            </View>
          ) : null}

          <View style={styles.grupoInputs}>
            <Text style={styles.etiquetaInput}>Correo electrónico</Text>
            <TextInput
              style={styles.inputEstilizado}
              placeholder="📧 tucorreo@correo.com"
              placeholderTextColor="#9CA3AF"
              value={correoEscrito}
              onChangeText={setCorreoEscrito}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.etiquetaInput}>Contraseña</Text>
            <TextInput
              style={styles.inputEstilizado}
              placeholder="🔑 Mínimo 8 caracteres"
              placeholderTextColor="#9CA3AF"
              value={claveEscrita}
              onChangeText={setClaveEscrita}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.botonPrincipal}
            onPress={botonPrincipalApretado}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotonPrincipal}>
              {estamosEnRegistro ? "Registrarse ahora" : "Ingresar al sistema"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setEstamosEnRegistro(!estamosEnRegistro);
              setListaErrores([]);
              setMensajeExito("");
            }}
            style={styles.botonCambioModo}
          >
            <Text style={styles.textoModoSecundario}>
              {estamosEnRegistro
                ? "¿Ya tenés una cuenta? Iniciar Sesión"
                : "Registrate acá"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedorPrincipal: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  tecladoAjuste: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  tarjetaLogin: {
    backgroundColor: "#d6dfff",
    borderRadius: 0,
    padding: 24,
    shadowColor: "#fffb04",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  contenedorTitulo: {
    alignItems: "center",
    marginBottom: 24,
  },
  tituloPrincipal: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#020202",
    textAlign: "center",
    marginBottom: 6,
  },
  grupoInputs: {
    marginBottom: 30,
  },
  etiquetaInput: {
    fontSize: 13,
    fontWeight: "600",
    color: "#00040a",
    marginBottom: 6,
  },
  inputEstilizado: {
    backgroundColor: "#efefef",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0d0d0e",
    marginBottom: 14,
  },
  botonPrincipal: {
    backgroundColor: "#3aa3f3",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#1307f9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  textoBotonPrincipal: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  botonCambioModo: {
    marginTop: 18,
    alignItems: "center",
  },
  textoModoSecundario: {
    color: "#4F46E5",
    fontSize: 13,
    fontWeight: "600",
  },
  cajaError: {
    backgroundColor: "#FEF2F2",
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  textoError: {
    color: "#991B1B",
    fontSize: 13,
  },
  cajaExito: {
    backgroundColor: "#e8c8e4",
    borderLeftWidth: 4,
    borderLeftColor: "#f800d3",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  textoExito: {
    color: "#f82c9c",
    fontSize: 13,
    fontWeight: "500",
  },
});
