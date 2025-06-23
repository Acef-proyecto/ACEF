// frontend/src/services/actaService.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/acta'; // Ajusta según tu entorno

// 📌 Subir archivo PDF al servidor
export const subirArchivoActa = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_BASE}/subir`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // { mensaje, url }
  } catch (error) {
    console.error('❌ Error al subir archivo:', error);
    throw error.response?.data || { mensaje: 'Error al subir el archivo.' };
  }
};

// 📌 Guardar URL en la base de datos
export const guardarURLActa = async (url) => {
  try {
    const response = await axios.post(`${API_BASE}/guardar`, {
      anexos: url,
    });

    return response.data; // { mensaje, acta_id }
  } catch (error) {
    console.error('❌ Error al guardar URL del acta:', error);
    throw error.response?.data || { mensaje: 'Error al guardar la URL del acta.' };
  }
};

// 📌 Compartir acta con otro instructor (requiere token)
export const compartirActa = async ({ id_acta, correo_destino, token }) => {
  try {
    const response = await axios.post(
      `${API_BASE}/compartir`,
      { id_acta, correo_destino },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // { mensaje }
  } catch (error) {
    console.error('❌ Error al compartir el acta:', error);
    throw error.response?.data || { mensaje: 'Error al compartir el acta.' };
  }
};
