// frontend/src/services/alertaService.js

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/alertas';

// Alerta de trimestre → sin mensaje ni correo de instructor
export const enviarAlertaTrimestral = async ({ fecha_inicio, fecha_fin }, token) => {
  try {
    const response = await axios.post(
      `${API_BASE}/trimestre`,
      { fecha_inicio, fecha_fin }, // solo lo necesario
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('[AlertaService] Error al enviar alerta de trimestre:', error);
    throw error.response?.data || { error: 'Error desconocido al enviar alerta trimestral' };
  }
};
