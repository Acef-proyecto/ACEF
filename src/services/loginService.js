import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth/login'; // Ajusta según tu backend

// Inicia sesión y retorna el token
export const login = async (credenciales) => {
  const response = await axios.post(`${API_URL}/login`, credenciales);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token); // Guarda el token
  }
  return response.data;
};

// Cierra sesión limpiando el token
export const logout = () => {
  localStorage.removeItem('token');
};

// Obtiene el token almacenado
export const getToken = () => {
  return localStorage.getItem('token');
};

// Verifica si el usuario está autenticado
export const isAuthenticated = () => {
  return !!getToken();
};

// Envía el token en las cabeceras
export const authHeader = () => {
  const token = getToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
};