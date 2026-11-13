import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Producto {
  idUnico: string;
  nombreDelProducto: string;
  fotoURI?: string;
  ubicacion?: string;
  contacto?: string;
}

interface ComprasState {
  listaDeProductos: Producto[];
}

const initialState: ComprasState = {
  listaDeProductos: [],
};

export const comprasSlice = createSlice({
  name: "compras",
  initialState,
  reducers: {
    agregarProducto: (state, action: PayloadAction<Producto>) => {
      state.listaDeProductos.push(action.payload);
    },
    borrarProducto: (state, action: PayloadAction<string>) => {
      state.listaDeProductos = state.listaDeProductos.filter(
        (producto) => producto.idUnico !== action.payload,
      );
    },
    limpiarProductos: (state) => {
      state.listaDeProductos = [];
    },

    asignarContacto: (
      state,
      action: PayloadAction<{ id: string; nombreContacto: string }>,
    ) => {
      const producto = state.listaDeProductos.find(
        (p) => p.idUnico === action.payload.id,
      );
      if (producto) {
        producto.contacto = action.payload.nombreContacto;
      }
    },
  },
});

export const {
  agregarProducto,
  borrarProducto,
  limpiarProductos,
  asignarContacto,
} = comprasSlice.actions;
export default comprasSlice.reducer;
