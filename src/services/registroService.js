import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Ajusta si tu backend tiene otra estructura

// 🔐 Registrar usuario (con nombre, apellido, correo, contraseña y rol)
export const register = async ({ nombre, apellido, correo, contraseña, rol }) => {
  const response = await axios.post(`${API_URL}/register`, {
    nombre,
    apellido,
    correo,
    contraseña,
    rol,
  });
  return response.data;
};

// 🔑 Iniciar sesión y guardar el token
export const login = async ({ correo, contraseña }) => {
  const response = await axios.post(`${API_URL}/login`, {
    correo,
    contraseña,
  });

  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }

  return response.data;
};

// 🚪 Cerrar sesión eliminando el token
export const logout = () => {
  localStorage.removeItem('token');
};

// 📦 Obtener el token guardado
export const getToken = () => {
  return localStorage.getItem('token');
};

// ✅ Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return !!getToken();
};

// 🛡️ Cabecera de autenticación
export const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
