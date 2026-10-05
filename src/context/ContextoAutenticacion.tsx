import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState } from "react";

type TipoDeContexto = {
  correoLogueado: string | null;
  registrarNuevoUsuario: (correo: string, clave: string) => Promise<boolean>;
  entrarAlSistema: (
    correo: string,
    clave: string,
  ) => Promise<{ exito: boolean; mensajeError?: string }>;
  salirDelSistema: () => Promise<void>;
};

const ContextoAutenticacion = createContext<TipoDeContexto>(
  {} as TipoDeContexto,
);

export const ProveedorAutenticacion: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [correoLogueado, setCorreoLogueado] = useState<string | null>(null);

  const registrarNuevoUsuario = async (
    correoNuevo: string,
    claveNueva: string,
  ) => {
    try {
      const baseDeDatos = await AsyncStorage.getItem("USUARIOS_GUARDADOS");
      console.log("Usuarios guardados en AsyncStorage:", baseDeDatos);

      const listaUsuarios = baseDeDatos ? JSON.parse(baseDeDatos) : [];

      const usuarioYaExiste = listaUsuarios.find(
        (usuario: any) => usuario.correo === correoNuevo.toLowerCase(),
      );

      if (usuarioYaExiste) return false;

      listaUsuarios.push({
        correo: correoNuevo.toLowerCase(),
        clave: claveNueva,
      });

      await AsyncStorage.setItem(
        "USUARIOS_GUARDADOS",
        JSON.stringify(listaUsuarios),
      );
      console.log("Usuario registrado con éxito:", correoNuevo.toLowerCase());

      return true;
    } catch (error) {
      console.log("Error al registrar usuario:", error);
      return false;
    }
  };

  const entrarAlSistema = async (
    correoIngresado: string,
    claveIngresada: string,
  ) => {
    try {
      const baseDeDatos = await AsyncStorage.getItem("USUARIOS_GUARDADOS");
      console.log("DB actual en AsyncStorage al intentar entrar:", baseDeDatos);
      const listaUsuarios = baseDeDatos ? JSON.parse(baseDeDatos) : [];

      const usuarioEncontrado = listaUsuarios.find(
        (usuario: any) => usuario.correo === correoIngresado.toLowerCase(),
      );

      if (!usuarioEncontrado) {
        console.log("❌ El usuario no existe en la lista.");
        return {
          exito: false,
          mensajeError: "El usuario no existe. Registrate primero.",
        };
      }

      if (usuarioEncontrado.clave !== claveIngresada) {
        console.log(
          "❌ Contraseña incorrecta. Guardada:",
          usuarioEncontrado.clave,
          "| Ingresada:",
          claveIngresada,
        );
        return { exito: false, mensajeError: "Contraseña incorrecta." };
      }

      console.log("✅ ¡Login exitoso para:", usuarioEncontrado.correo);
      setCorreoLogueado(usuarioEncontrado.correo);

      await AsyncStorage.setItem("USUARIO_ACTIVO", usuarioEncontrado.correo);

      return { exito: true };
    } catch (error) {
      console.log("❌ Error en catch del login:", error);
      return { exito: false, mensajeError: "Error al iniciar sesión." };
    }
  };

  const salirDelSistema = async () => {
    setCorreoLogueado(null);
    await AsyncStorage.removeItem("USUARIO_ACTIVO");
  };

  return (
    <ContextoAutenticacion.Provider
      value={{
        correoLogueado,
        registrarNuevoUsuario,
        entrarAlSistema,
        salirDelSistema,
      }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  );
};

export const usarAutenticacion = () => useContext(ContextoAutenticacion);
