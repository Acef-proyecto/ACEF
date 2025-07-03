import axios from 'axios';

// 🔗 URL base del backend para actas (ajusta para producción si es necesario)
const API_BASE = 'http://localhost:3000/api/acta';

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

// 📩 Compartir un acta con otro instructor
export const compartirActa = async ({ id_acta, correo_destino }) => {
  const token = localStorage.getItem('token');

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

// 📊 Obtener actas por ficha y/o fechas (opcional para filtrar)
export const obtenerActas = async ({ ficha, startDate, endDate }) => {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams();

  if (ficha) params.append('ficha', ficha);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  try {
    const response = await axios.get(`${API_BASE}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // lista de actas
  } catch (error) {
    console.error('❌ Error al obtener actas:', error);
    throw error.response?.data || { mensaje: 'Error al obtener actas.' };
  }
};
