import axios from 'axios';

const API_URL = 'http://localhost:3000/api/alertas';

/**
 * Envía una alerta vinculada a uno o varios trimestres.
 * Notifica por correo a todos los instructores activos.
 *
 * @param {Object} data - Objeto con:
 *   @property {string} mensaje - Texto del mensaje de la alerta.
 *   @property {string} fecha_inicio - Fecha de inicio del rango.
 *   @property {string} fecha_fin - Fecha de fin del rango.
 * @returns {Promise<Object>} - Resultado del servidor con `ok` y `totalCorreos`.
 */
export const enviarAlertaTrimestral = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/trimestre`, data);
    return response.data;
  } catch (error) {
    console.error('Error al enviar la alerta trimestral:', error);
    throw error;
  }
};
