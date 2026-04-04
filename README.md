chequea# dondeAlquiloSF

Plataforma colaborativa de reseñas de alquileres en Santa Fe, Argentina.

## Características
- Registro con Google/Facebook (OAuth2).
- Mapa interactivo con Leaflet.
- Georreferenciación de propiedades.
- Reseñas con estrellas y comentarios.
- Mensajería interna en tiempo real (Socket.io).

## Tecnologías
- **Frontend**: React, Leaflet, Axios, Tailwind CSS.
- **Backend**: Node.js, Express, Socket.io, Passport.js.
- **Base de Datos**: Firestore.

## Instalación y Configuración

1. Clonar el repositorio.
2. Configurar las variables de entorno en `.env`.
3. Instalar dependencias:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
4. Ejecutar el proyecto:
   - Backend: `cd server && npm run dev`
   - Frontend: `cd client && npm start`

## Variables de Entorno (.env)
Se requiere una cuenta de servicio de Firebase y credenciales de Google Cloud Console para OAuth.
