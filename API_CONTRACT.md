# API Contract — Sistema de Asistencia

Este documento define la interfaz de comunicación entre el Frontend (React) y el Backend.
Todas las respuestas deben ser en formato JSON.

## 🔐 Autenticación

### Login
**POST** `/api/auth/login`

Permite el inicio de sesión para administradores y usuarios.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200 OK):**
```json
{
  "token": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "user": {
    "id": "uuid",
    "name": "Juan Perez",
    "role": "admin" // o "user"
  }
}
```

### Refresh Token
**POST** `/api/auth/refresh`

Renueva el access token usando el refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response (200 OK):**
```json
{
  "token": "new_jwt_access_token"
}
```

---

## 👑 Admin — Gestión de QR

### Obtener QR Activo
**GET** `/api/admin/qr/active`

Obtiene el token del QR actual válido. Si no existe o expiró, el backend puede generar uno nuevo automáticamente o devolver 404.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "qrToken": "random_secure_string",
  "expiresAt": "2023-10-27T10:10:00Z",
  "serverTime": "2023-10-27T10:00:00Z"
}
```

### Forzar Regeneración de QR
**POST** `/api/admin/qr/generate`

Fuerza la creación de un nuevo código QR, invalidando el anterior.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "qrToken": "new_random_secure_string",
  "expiresAt": "2023-10-27T10:20:00Z"
}
```

---

## 🙋‍♂️ Asistencia (Usuarios)

### Marcar Asistencia
**POST** `/api/attendance/mark`

Registra la asistencia del usuario escaneando el token del QR.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "qrToken": "token_scanned_from_qr",
  "deviceInfo": "User Agent or Device ID (optional)"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Asistencia registrada correctamente",
  "timestamp": "2023-10-27T10:05:00Z"
}
```

**Response (400 Bad Request):**
- Token inválido o expirado.
- Usuario ya marcó asistencia para este evento/sesión.

### Historial de Asistencia (Usuario)
**GET** `/api/attendance/history`

Obtiene las asistencias marcadas por el usuario actual.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
[
  {
    "id": "attendance_id",
    "date": "2023-10-27T10:05:00Z",
    "status": "present"
  }
]
```
