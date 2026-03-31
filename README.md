# 📱 Rate My Music - Frontend UI (La Cabeza)

Bienvenido a la documentación de **RateMyMusicPage**. Esta es la aplicación frontend principal, desarrollada con **Angular 19**.

## 🚀 ¿Qué hace este servicio?

Este es el punto exclusivo de interacción para los usuarios finales. Sus responsabilidades incluyen:
- Renderizar la interfaz de usuario (UI).
- Manejar la experiencia de navegación (Routing) y estado de la aplicación.
- Proveer un reproductor de música integrado en el navegador.
- Enviar de manera segura los Tokens JWT al Backend.
- **Nota Importante:** Este servicio *nunca* se comunica directamente con los microservicios de Auth o Media. **Todas sus peticiones HTTP se dirigen al API Gateway.**

**Stack Tecnológico:** Angular 19, TypeScript, RxJS, HTML/CSS.

## 📁 Estructura del Proyecto

La estructura sigue las mejores prácticas recomendadas por Angular, alojada dentro de `src/`:

- `src/app/`: Carpeta principal donde reside toda la lógica de la aplicación.
  - `components/`: Componentes UI reutilizables (Botones, reproductores, tarjetas).
  - `pages/` (o vistas): Componentes enrutables (Login, Home, Perfil).
  - `services/`: Lógica de inyección de dependencias (`MusicService`, `AuthService`) que encapsula las llamadas HTTP con `HttpClient`.
  - `interceptors/`: Interceptores de HTTP (ej. para adjuntar automáticamente el JWT Token en todos los requests).
  - `app.routes.ts`: Configuración del ruteo de la aplicación.
- `src/assets/`: Archivos estáticos como imágenes, íconos y fuentes.
- `src/environments/`: Configuración por entorno (Desarrollo vs. Producción). Aquí definirás la URL del API Gateway.
- `angular.json`: Configuración maestra del CLI de Angular.

## 🛠️ Requisitos Previos

- [Node.js](https://nodejs.org/) instalado.
- [Angular CLI](https://angular.dev/tools/cli) (Opcional pero recomendado: `npm install -g @angular/cli`).

## 🏃‍♂️ Cómo levantar el proyecto localmente

1. **Instalar dependencias:**
   ```bash
   npm install
   # o pnpm install
   ```

2. **Configurar el entorno:**
   Verifica el archivo `src/environments/environment.ts` o `environment.development.ts`. Asegúrate de que `apiUrl` apunte al puerto del Gateway (por defecto `http://localhost:5000` o `http://localhost:4000`, dependiendo de tu config).

3. **Ejecutar servidor de desarrollo:**
   ```bash
   ng serve -o
   ```
   Esto compilará la aplicación y la abrirá automáticamente en tu navegador (típicamente `http://localhost:4200`).

---

## 🏗️ Topología del Ecosistema

Para entender cómo encaja esta pieza en el rompecabezas de 4 partes:

1. 👤 **La Cabeza:** [RateMyMusicPage](https://github.com/Jhomel-Dev/RateMyMusicPage) (👉 **Estás aquí**)
2. 🚪 **El Cuello:** [RateMyMusicGateway](https://github.com/Jhomel-Dev/RateMyMusicGateway) - Enrutador al que debes apuntar.
3. 🦶 **Los Pies (Backend):**
   * 🔐 **RateMyMusicAuth:** Usuarios y seguridad.
   * ☁️ **RateMyMusicMedia:** Multimedia y base de datos de música.
