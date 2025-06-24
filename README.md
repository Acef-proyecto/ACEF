
# ACEF

## Descripción
ACEF es una aplicación full-stack para gestionar procesos académicos en entornos del SENA, permitiendo el registro de usuarios (instructores y coordinadores), CRUD de aprendices y competencias, generación de actas en PDF y alertas de fechas límite.

## ❗ Problema que Soluciona
En el Centro de Mercadeo, Logística y Tecnologías de la Información del SENA (Bogotá D.C., Chapinero), el seguimiento a las fichas de formación y la asignación de competencias se realiza manualmente a través de archivos Excel, lo cual genera múltiples dificultades:

- **Falta de trazabilidad** en el seguimiento académico.
- **Errores o demoras** en la asignación de competencias.
- **Evaluaciones incompletas** por parte de instructores ausentes.
- **Sobrecarga administrativa** para los coordinadores.
- **Poca visibilidad** del estado real del proceso educativo.

ACEF surge como solución a estos problemas, proporcionando una plataforma centralizada que mejora la eficiencia operativa, garantiza la calidad formativa y permite un seguimiento más transparente del progreso de los aprendices.

## 👥 Equipo de Desarrollo

- Laura Liseth Buitrago Castillo
- Leslye Marcela Buitrago Mora
- Samuel Andrés Torres Romero
- David Santiago Rubiano Hernández  

## Funcionalidades principales
- **Autenticación y autorización** mediante JWT
- **Gestión de usuarios**: roles de instructor y coordinador
- **CRUD de aprendices y competencias** con búsquedas y filtros
- **Generación de actas** en PDF usando html2canvas y jsPDF
- **Alertas de fechas** para seguimiento de entregas
- **API REST** documentada y escalable

## Tecnologías
- **Backend**: Node.js, Express, MySQL (mysql2)
- **Frontend**: React, Vite, React Router Dom, Axios
- **Autenticación**: bcrypt, JSON Web Tokens (JWT)
- **Documentos**: html2canvas, jsPDF
- **Entorno**: dotenv
- **Calidad de código**: ESLint

## Requisitos previos
- Node.js v18+
- npm o yarn
- MySQL 8.x

## Instalación
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Acef-proyecto/acef.git
   cd acef
   ```
2. Instalar dependencias de backend y frontend:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

## Configuración
1. Copiar y renombrar los archivos de entorno:
   ```bash
   cd backend && cp .env.example .env
   cd ../frontend && cp .env.example .env
   ```
2. Configurar variables en `backend/.env`:
   ```ini
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=acef_db
   JWT_SECRET=tu_secreto
   ```
3. (Opcional) Ajustar puertos o endpoints en `frontend/.env`.

## Ejecución en desarrollo
1. Iniciar servidor backend:
   ```bash
   cd backend
   npm run dev
   ```
2. Levantar frontend:
   ```bash
   cd frontend
   npm run dev
   ```
3. Abrir en el navegador `http://localhost:5173`

## Pruebas
> **Próximamente**: se incluyen pruebas unitarias con Jest (backend) y React Testing Library (frontend).

## Estructura del proyecto
```
acef/
├── backend/
│   ├── config/       # Configuración de la base de datos y entorno
│   ├── controllers/  # Lógica de negocio
│   ├── routes/       # Definición de rutas API
│   ├── models/       # Modelos de datos
│   ├── middleware/   # Autenticación y validación
│   └── app.js        # Inicialización del servidor
├── frontend/
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── pages/       # Páginas y rutas
│   │   ├── services/    # Llamadas a la API
│   │   └── App.jsx      # Punto de entrada
│   └── vite.config.js
└── README.md
```

## Licencia
Este proyecto está bajo la [MIT License](LICENSE).

## Contacto
Para dudas o mejoras, contacta a:
- Correo: torresromerosamuelandres@gmail.com
- Correo: laurabuitrago760@gmail.com 
- Correo: sntgrubiano@gmail.com
- Correo: leslyemarcelab@gmail.com 
- GitHub: [samuelt14](https://github.com/samuelt14)
- GitHub: [Lisseth77](https://github.com/Lisseth77)
- GitHub: [SantiagoR29](https://github.com/SantiagoR29)
- GitHub: [MarceB2006](https://github.com/MarceB2006)
