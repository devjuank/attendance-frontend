# 📅 Plan de Acción: De 0 a Deploy en S3

Este documento detalla los pasos necesarios para construir, configurar y desplegar la aplicación frontend del Sistema de Asistencia.

---

## 🏗 Fase 1: Inicialización y Configuración

1.  **Crear Proyecto Vite**
    *   Comando: `npm create vite@latest attendance-frontend -- --template react-ts`
    *   Instalar dependencias: `npm install`

2.  **Configurar TailwindCSS**
    *   Instalar: `npm install -D tailwindcss postcss autoprefixer`
    *   Inicializar: `npx tailwindcss init -p`
    *   Configurar `tailwind.config.js` y `index.css`.

3.  **Estructura de Carpetas**
    *   Crear directorios según la propuesta (`src/app`, `src/pages`, `src/components`, etc.).
    *   Limpiar archivos por defecto de Vite.

4.  **Instalar Librerías Core**
    *   Routing: `react-router-dom`
    *   HTTP: `axios`
    *   QR: `qrcode.react` (Admin), `react-qr-reader` (Scanner - futuro)
    *   Utils: `clsx`, `tailwind-merge` (opcional para estilos)

---

## 💻 Fase 2: Desarrollo del Core

1.  **Configuración de Rutas (`src/app/routes.tsx`)**
    *   Definir rutas públicas (Login).
    *   Definir rutas privadas (Admin, Attendance).
    *   Crear `PrivateRoute` component para protección por rol.

2.  **Cliente API (`src/services/apiClient.ts`)**
    *   Configurar instancia de Axios.
    *   Interceptors para adjuntar Token JWT.
    *   Manejo de errores (401 -> redirect login).

3.  **Contexto de Autenticación (`src/hooks/useAuth.ts`)**
    *   Login, Logout, Refresh Token.
    *   Persistencia en `localStorage` o `cookies`.

---

## 🚀 Fase 3: Implementación de Features

1.  **Módulo de Autenticación**
    *   `LoginPage.tsx`: Formulario de email/password.
    *   Integración con endpoint `/api/auth/login`.

2.  **Módulo Admin**
    *   `DashboardPage.tsx`: Vista general.
    *   `LiveQrPage.tsx`:
        *   Fetching de QR activo (`/api/admin/qr/active`).
        *   Renderizado de QR con `qrcode.react`.
        *   Timer de renovación (10 min).

3.  **Módulo Usuario (Asistencia)**
    *   `ScanHandlerPage.tsx`:
        *   Captura de `token` desde URL query param.
        *   Validación y llamada a `/api/attendance/mark`.
    *   `ConfirmPage.tsx`: Feedback visual (Éxito/Error).

---

## 🧪 Fase 4: Build y Pruebas Locales

1.  **Linting y Type Checking**
    *   Ejecutar `npm run lint`.
    *   Verificar `tsc` sin errores.

2.  **Build de Producción**
    *   Ejecutar `npm run build`.
    *   Verificar carpeta `dist/` generada.
    *   Probar localmente: `npm run preview`.

---

## ☁️ Fase 5: Deploy en AWS S3 + CloudFront

### 1. Preparar Bucket S3
1.  Crear Bucket (ej. `attendance-frontend-app`).
2.  Habilitar **Static Website Hosting**.
3.  Desactivar "Block all public access" (si se usa política de bucket pública) O configurar OAI/OAC si se usa CloudFront (recomendado).
4.  Política de Bucket (si es acceso público directo):
    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::attendance-frontend-app/*"
            }
        ]
    }
    ```

### 2. Subir Archivos
*   Comando manual:
    `aws s3 sync dist/ s3://attendance-frontend-app --delete`
*   O subir carpeta `dist` vía consola AWS.

### 3. Configurar CloudFront (CDN) - Recomendado
1.  Crear distribución.
2.  Origin domain: El endpoint del bucket S3.
3.  **Viewer Protocol Policy**: Redirect HTTP to HTTPS.
4.  **Default Root Object**: `index.html`.
5.  **Error Pages**:
    *   404 Not Found -> Path: `/index.html` -> Response Code: `200` (Necesario para SPA Routing).

### 4. Verificación
*   Acceder a la URL de CloudFront (ej. `d12345.cloudfront.net`).
*   Verificar navegación y recarga de páginas (SPA fix).
