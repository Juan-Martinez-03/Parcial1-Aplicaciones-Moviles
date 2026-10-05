import { validateLoginInput } from "../validadores";

describe("Pruebas Unitarias - Validaciones de Login", () => {
  it("Debería devolver error si el email está vacío", () => {
    const errores = validateLoginInput("", "12345678");
    expect(errores).toContain("El email es requerido");
  });

  it("Debería devolver error si el email tiene un formato inválido", () => {
    const errores = validateLoginInput("juanmartinez.com", "12345678");
    expect(errores).toContain("El email no tiene un formato válido");
  });

  it("Debería devolver error si la contraseña está vacía", () => {
    const errores = validateLoginInput("juan@ejemplo.com", "");
    expect(errores).toContain("La contraseña es requerida");
  });

  it("Debería devolver error si la contraseña es menor a 8 caracteres", () => {
    const errores = validateLoginInput("juan@ejemplo.com", "12345");
    expect(errores).toContain("La contraseña debe tener al menos 8 caracteres");
  });

  it("Debería pasar sin errores si los datos son correctos", () => {
    const errores = validateLoginInput("juan@ejemplo.com", "claveSegura123");
    expect(errores.length).toBe(0);
  });
});
