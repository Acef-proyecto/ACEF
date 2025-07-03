import axios from 'axios';

// 🔗 URL base del backend para actas
const API_BASE = 'http://localhost:3000/api/acta';
const FICHA_API = 'http://localhost:3000/api/ficha';

// 📤 Subir un archivo PDF y asociarlo a una ficha
export const subirArchivoActa = async (file, fichaId) => {
  const formData = new FormData();
  formData.append('archivo', file);
  formData.append('ficha_id', fichaId);

  const token = localStorage.getItem('token');

  try {
    const response = await axios.post(`${API_BASE}/subir`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // { mensaje, actaId, url }
  } catch (error) {
    console.error('❌ Error al subir archivo:', error);
    throw error.response?.data || { mensaje: 'Error al subir el archivo.' };
  }
};

// 🗂 Guardar la URL del acta manualmente (si es necesario)
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

// 🔍 Buscar el ID real de una ficha dado su número
export const buscarFichaIdPorNumero = async (numeroFicha) => {
  try {
    const response = await axios.get(`${FICHA_API}/buscar?numero=${numeroFicha}`);
    return response.data?.id_ficha || null;
  } catch (error) {
    console.error('❌ Error al buscar ficha:', error);
    return null;
  }
};
