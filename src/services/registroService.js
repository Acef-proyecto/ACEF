import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/auth'; // Asegúrate de que el puerto coincida con tu backend

// 🔐 Registrar nuevo usuario
export const registrarUsuario = async ({ nombre, apellido, correo, contraseña, rol, contacto }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      Nombre: nombre,
      Apellido: apellido,
      Correo: correo,
      Contraseña: contraseña,
      rol,
      contacto
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.mensaje) {
      throw new Error(error.response.data.mensaje);
    } else {
      throw new Error('Error al registrar usuario');
    }
  }
};
