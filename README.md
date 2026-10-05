# Parcial - Lista de compras inteligente

**Alumno:** Juan Ignacio Martinez

### 📌 Opción elegida

Elegí desarrollar la **Lista de compras inteligente**.

## Estructura del Proyecto

```text
├── src/
│   ├── components/
│   │   └── ModalAgregar.tsx
│   ├── context/
│   │   └── ContextoAutenticacion.tsx
│   ├── hooks/
│   │   └── usarListaCompras.ts
│   ├── screens/
│   │   ├── PantallaLogin.tsx
│   │   └── PantallaPrincipal.tsx
│   └── utils/
│       ├── __tests__/
│       │   └── validadores.test.ts
│       └── validadores.ts
```

## Vista Previa del test

![test](/assets/test.jpg)

## Cómo ejecutar la app

1. Para arrancar: `npm install` y luego `npx expo start`
2. Para correr los tests: `npm test`

## Funcionalidades implementadas

- **Login y Registro:** Validé el formato del correo y que la clave tenga al menos 8 caracteres. Sin cuenta no se puede entrar.
- **Guardado :** Cada usuario tiene su lista privada y no se borra al cerrar la app.
- **Lista de compras:** Podés agregar productos y borrarlos tocando la "X".
- **Notificaciones:** Cuando agregás algo, al segundo te llega un aviso.
- **Diseño:** Armé una interfaz simple y usé un Modal para agregar cosas rápido sin cambiar de pantalla.

## Video DEMO

[Enlace Video DEMO de la app en youtube.](https://www.youtube.com/watch?v=yNs6xG67alY)
