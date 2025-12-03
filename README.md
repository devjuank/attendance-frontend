# Sistema de Asistencia — Frontend

Este repositorio contiene el frontend del sistema de asistencia basado en QR dinámicos.
La aplicación permite que admins generen códigos de asistencia y usuarios marquen su asistencia escaneando el QR, manteniendo una sesión activa en todo momento.

# 🚀 Setup Guide - Sistema de Asistencia

Esta guía te ayudará a configurar y ejecutar el proyecto del Sistema de Asistencia (Frontend).

---

## 📋 Prerrequisitos

- **Node.js**: v20.19+ o v22.12+ (recomendado)
- **npm**: v9.7.2 o superior
- **Git**: Para clonar el repositorio

### Verificar versiones instaladas

```bash
node --version
npm --version
```

---

## 🛠 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd attend-sys
```

### 2. Instalar dependencias del frontend

```bash
cd attendance-frontend
npm install
```

---

## 🏃 Ejecutar el proyecto

### Modo Desarrollo (con Hot Reload)

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

### Modo Preview (Build de producción)

```bash
npm run build
npm run preview
```

La aplicación estará disponible en: **http://localhost:4173**

---

## 📁 Estructura del Proyecto

```
attendance-frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── app/            # Configuración de la app y rutas
│   ├── pages/          # Páginas de la aplicación
│   │   ├── login/      # Página de login
│   │   ├── admin/      # Dashboard y Live QR
│   │   └── attendance/ # Escaneo y confirmación
│   ├── components/     # Componentes reutilizables
│   ├── hooks/          # Custom hooks (useAuth)
│   ├── services/       # API client y servicios
│   ├── config/         # Configuración
│   └── styles/         # Estilos globales
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz de `attendance-frontend/`:

```env
VITE_API_URL=http://localhost:8080/api
```

**Nota:** Ajusta la URL según tu configuración de backend.

---

## 🧪 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta el linter (ESLint) |

---

## 🎨 Tecnologías Utilizadas

- **React 19** - Librería UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router** - Navegación
- **TailwindCSS** - Estilos
- **Axios** - Cliente HTTP
- **QRCode.react** - Generación de códigos QR

---

## 🔐 Autenticación

El sistema utiliza JWT para autenticación:

1. El usuario inicia sesión en `/login`
2. El backend devuelve un `token` y `refreshToken`
3. Los tokens se almacenan en `localStorage`
4. El `apiClient` adjunta automáticamente el token en cada request
5. Si el token expira, se renueva automáticamente con el `refreshToken`

---

## 📱 Rutas de la Aplicación

### Públicas
- `/login` - Página de inicio de sesión

### Privadas (requieren autenticación)
- `/admin` - Dashboard del administrador
- `/admin/live-qr` - Pantalla de QR en vivo
- `/attendance?token=XYZ` - Procesar asistencia
- `/attendance/confirm` - Confirmación de asistencia

---

## 🐛 Troubleshooting

### Error: "Unsupported engine"

Si ves warnings sobre la versión de Node.js, actualiza a la versión recomendada:

```bash
nvm install 22
nvm use 22
```

### Puerto en uso

Si el puerto está ocupado, puedes especificar uno diferente:

```bash
npm run dev -- --port 3000
```

### Problemas con TailwindCSS

Si los estilos no se aplican, verifica que `tailwind.config.js` esté correctamente configurado y que `global.css` contenga las directivas de Tailwind.

---

## 📚 Documentación Adicional

- [README.md](./README.md) - Descripción general del proyecto
- [API_CONTRACT.md](./API_CONTRACT.md) - Especificación de la API
- [ACTION_PLAN.md](./ACTION_PLAN.md) - Plan de desarrollo y deploy

---

## 🚀 Próximos Pasos

1. **Configurar el Backend**: Asegúrate de tener el backend corriendo
2. **Probar la Integración**: Verifica que el frontend se comunique correctamente con la API
3. **Deploy**: Sigue las instrucciones en [ACTION_PLAN.md](./ACTION_PLAN.md) para desplegar en AWS S3

---

## 📞 Soporte

Si encuentras algún problema, revisa:
- Los logs de la consola del navegador
- Los logs del servidor de desarrollo
- La documentación de la API en `API_CONTRACT.md`
