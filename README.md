# Sistema de Asistencia — Frontend

Fase 1 — Web App (React)

Este repositorio contiene el frontend del sistema de asistencia basado en QR dinámicos.
La aplicación permite que admins generen códigos de asistencia y usuarios marquen su asistencia escaneando el QR, manteniendo una sesión activa en todo momento.

---

## 📌 1. Requerimientos

### Funcionales
- Los administradores pueden visualizar un QR dinámico, renovado cada 10 minutos.
- Los usuarios pueden marcar asistencia escaneando el QR.
- Los usuarios necesitan tener sesión iniciada antes o después del escaneo.
- El frontend debe permitir:
  - Inicio de sesión
  - Visualización del QR para administradores
  - Confirmación de asistencia
  - Flujo automático post-escaneo
  - Detección del qrToken desde la URL o desde el escáner interno

### No funcionales
- Debe ser rápido y responsive (desktop & mobile).
- Debe funcionar como Web App (PWA opcional más adelante).
- Integración segura con backend mediante HTTPS + JWT.
- Código organizado, modular y fácil de mantener.
- Preparado para deploy en S3 + CloudFront.

---

## 🧱 2. Propuesta de Stack Tecnológico (Frontend)

### Core
- React (con Vite)
- TypeScript
- React Router para navegación
- Axios o fetch encapsulado para llamadas API

### UI / Helpers
- TailwindCSS (rápido para prototipar)
- react-query / tanstack-query (opcional para estados remotos)
- QRCode.react para mostrar QR (si hace falta del lado admin)
- react-qr-reader / zxing para escaneo en navegador (fase futura)

### Build & Deploy
- Build estático con Vite → carpeta /dist
- Hosting en Amazon S3
- Distribución con CloudFront

---

## 🚀 3. Features del Frontend

### MVP

#### Usuarios:
- Login con email + password
- Persistencia de sesión (JWT + refresh)
- Captura del qrToken desde:
  - Parámetro URL (/attendance?token=XYZ)
  - Lector QR (futuro)
- Envío de registro de asistencia
- Pantalla de confirmación de asistencia

#### Admin:
- Login admin
- Dashboard simple
- Pantalla: “Asistencia en Vivo”
- QR dinámico renovado cada 10 min
- Timer visual

### Futuro
- Soporte PWA
- Escaneo integrado desde cámara
- Tabla de asistencias
- Panel de gestión de usuarios / eventos

---

## 📂 4. Estructura de Carpetas Propuesta

```
attendance-frontend/
├── public/
│   ├── index.html
│   └── icons/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── pages/
│   │   ├── login/
│   │   │   └── LoginPage.tsx
│   │   ├── admin/
│   │   │   ├── DashboardPage.tsx
│   │   │   └── LiveQrPage.tsx
│   │   └── attendance/
│   │       ├── ScanHandlerPage.tsx
│   │       └── ConfirmPage.tsx
│   ├── components/
│   │   ├── qr/
│   │   │   └── QrDisplay.tsx
│   │   ├── forms/
│   │   └── layout/
│   │       └── Navbar.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useApi.ts
│   ├── services/
│   │   └── apiClient.ts
│   ├── config/
│   │   └── env.ts
│   └── styles/
│       └── global.css
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```
