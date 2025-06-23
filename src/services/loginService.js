import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth/'; 

// Registrar nuevo usuario
export const registrarUsuario = async (datos) => {
  try {
    const response = await axios.post(`${API_URL}/register`, datos);
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al registrar usuario' };
  }
};

// Iniciar sesión
export const loginUsuario = async (datos) => {
  try {
    const response = await axios.post(`${API_URL}/login`, datos);
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al iniciar sesión' };
  }
};

// Solicitar correo de recuperación de contraseña
export const enviarCorreoRecuperacion = async (correo) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { correo });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al enviar correo de recuperación' };
  }
};

// Restablecer contraseña con token
export const restablecerContrasena = async (token, nuevaPassword) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password/${token}`, { nuevaPassword });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensaje: 'Error al restablecer contraseña' };
  }
};
