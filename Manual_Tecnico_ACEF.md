
# 🧠 Manual Técnico Profesional – Proyecto ACEF

Este documento ofrece una descripción exhaustiva del proyecto **ACEF**, cubriendo tanto el **backend** como el **frontend**, así como la estructura de carpetas, detalles de configuración, dependencias y guías de despliegue.

---

## 📌 1. Descripción General

ACEF es una aplicación web para la gestión integral de actas, alertas y usuarios en instituciones educativas. Permite:

- 📝 Generar, subir y consultar actas en formato PDF.
- 🚨 Gestionar alertas y notificaciones a usuarios.
- 🔐 Autenticación y autorización por roles (Coordinador, Instructor, Administrador).
- 🔍 Búsqueda avanzada de registros por múltiples criterios.

La solución está dividida en dos módulos principales:

1. **Backend (Node.js + Express + MySQL)**
2. **Frontend (React + Vite + CSS modular)**

---

## 🧾 2. Requisitos

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **MySQL** ≥ 8.x
- **Git** para control de versiones
- Navegador moderno (Chrome, Firefox, Edge)

---

## 🗂️ 3. Estructura del Proyecto

```plaintext
ACEF/
├── basefinal.sql               # Script de creación de la base de datos y tablas
├── README.md                   # Documentación principal
├── backend/                    # Servicio RESTful
│   ├── config/                 # Configuraciones (DB, JWT, correo)
│   ├── controllers/            # Lógica de negocio por entidad
│   ├── middleware/             # Autenticación y validaciones
│   ├── routes/                 # Definición de endpoints Express
│   ├── services/               # Servicios auxiliares (alertas, búsquedas)
│   ├── uploads/                # Almacenamiento de archivos (actas, firmas)
│   └── server.js               # Punto de entrada
└── frontend/                   # Interfaz de usuario
    ├── src/
    │   ├── assets/             # Imágenes y recursos estáticos
    │   ├── component/          # Componentes React agrupados por agencia
    │   ├── styles/             # CSS modular para cada componente
    │   ├── App.jsx             # Componente raíz
    │   └── main.jsx            # Arranque de la aplicación
    ├── index.html              # Plantilla HTML
    └── vite.config.js          # Configuración de Vite
```

---

## ⚙️ 4. Backend

### 🔌 4.1 Configuración de Base de Datos

- **Script SQL**: `basefinal.sql` (esquema completo de tablas y relaciones).
- **Conexión**: en `backend/config/db.js`, se utilizan variables de entorno definidas en `.env`:

```ini
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASS=tu_contraseña
DB_NAME=acef_db
```

### 🏗️ 4.2 Estructura de Carpetas

- `config/`: conexión a base de datos, JWT, correo.
- `controllers/`: lógica de negocio.
- `middleware/`: autenticación y validaciones.
- `routes/`: definición de endpoints.
- `services/`: funciones auxiliares.
- `uploads/`: almacenamiento de archivos.

### 🚀 4.3 Arranque y Despliegue

```bash
cd backend
cp .env.example .env
# Editar variables de entorno
npm install
mysql -u user -p acef_db < basefinal.sql
npm start
```

Servicio disponible en `http://localhost:4000`.

---

## 🎨 5. Frontend

### ⚙️ 5.1 Configuración

```bash
cd frontend
npm install
npm run dev
```

Para producción:

```bash
npm run build
```

### 📁 5.2 Estructura

- `assets/`: logos e imágenes.
- `component/`: por módulo (Login, Actas, Alertas, Filtro, etc.).
- `styles/`: CSS modular.
- `App.jsx`: enrutamiento principal.
- `main.jsx`: entrada Vite.

---

## 🧩 6. Contribución y Buenas Prácticas

- 🔀 **Ramas Git**: usar `develop` y `feature/*`.
- ✏️ **Commits**: `tipo: descripción concisa`.
- 🧪 **Linting**: `npm run lint`
- 🧵 **Pull Requests**: con descripción detallada y revisiones.

---

## 📄 7. Licencia

Este proyecto está licenciado bajo la **MIT License**. Consulte `LICENSE` para detalles.

---

> *Fin del Manual Técnico – Proyecto ACEF*
