import { SafeAreaProvider } from "react-native-safe-area-context";
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
    <SafeAreaProvider>
      <ProveedorAutenticacion>
        <NavegacionPrincipal />
      </ProveedorAutenticacion>
    </SafeAreaProvider>
  );
}
