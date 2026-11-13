import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";

import {
  ProveedorAutenticacion,
  usarAutenticacion,
} from "./src/context/ContextoAutenticacion";
import PantallaLogin from "./src/screens/PantallaLogin";
import PantallaPrincipal from "./src/screens/PantallaPrincipal";

function NavegacionPrincipal() {
  const { correoLogueado } = usarAutenticacion();

  return correoLogueado ? <PantallaPrincipal /> : <PantallaLogin />;
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ProveedorAutenticacion>
          <NavegacionPrincipal />
        </ProveedorAutenticacion>
      </SafeAreaProvider>
    </Provider>
  );
}
