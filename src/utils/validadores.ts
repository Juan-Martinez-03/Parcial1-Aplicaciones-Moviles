export function validateLoginInput(
  correoEscrito: string,
  claveEscrita: string,
): string[] {
  const listaDeErrores: string[] = [];

  if (!correoEscrito.trim()) {
    listaDeErrores.push("El email es requerido");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoEscrito)) {
    listaDeErrores.push("El email no tiene un formato válido");
  }

  if (!claveEscrita) {
    listaDeErrores.push("La contraseña es requerida");
  } else if (claveEscrita.length < 8) {
    listaDeErrores.push("La contraseña debe tener al menos 8 caracteres");
  }

  return listaDeErrores;
}
