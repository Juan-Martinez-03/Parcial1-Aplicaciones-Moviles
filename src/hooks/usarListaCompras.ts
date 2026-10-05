import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { usarAutenticacion } from "../context/ContextoAutenticacion";

export interface Producto {
  idUnico: string;
  nombreDelProducto: string;
}

export function usarListaCompras() {
  const { correoLogueado } = usarAutenticacion();
  const [listaDeProductos, setListaDeProductos] = useState<Producto[]>([]);

  const llaveDeMemoria = correoLogueado
    ? `@compras_de_${correoLogueado}`
    : `@compras_de_invitado`;

  useEffect(() => {
    cargarCosasGuardadas();
  }, [correoLogueado]);

  const cargarCosasGuardadas = async () => {
    try {
      const cosasGuardadas = await AsyncStorage.getItem(llaveDeMemoria);

      if (cosasGuardadas) {
        setListaDeProductos(JSON.parse(cosasGuardadas));
      } else {
        setListaDeProductos([]);
      }
    } catch (error) {
      console.log("Error al cargar la lista");
    }
  };

  const agregarNuevoProducto = async (nombreCosa: string) => {
    if (!nombreCosa.trim()) return;

    const nuevoProducto = {
      idUnico: Date.now().toString(),
      nombreDelProducto: nombreCosa,
    };

    const listaActualizada = [nuevoProducto, ...listaDeProductos];
    setListaDeProductos(listaActualizada);

    await AsyncStorage.setItem(
      llaveDeMemoria,
      JSON.stringify(listaActualizada),
    );
  };

  const borrarProducto = async (idParaBorrar: string) => {
    const listaSinElBorrado = listaDeProductos.filter(
      (producto) => producto.idUnico !== idParaBorrar,
    );

    setListaDeProductos(listaSinElBorrado);

    await AsyncStorage.setItem(
      llaveDeMemoria,
      JSON.stringify(listaSinElBorrado),
    );
  };

  return { listaDeProductos, agregarNuevoProducto, borrarProducto };
}
