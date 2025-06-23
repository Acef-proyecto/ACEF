// frontend/src/services/alertasService.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const enviarAlertaTrimestre = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/alertas/trimestre`, data);
    return response.data;
  } catch (error) {
    console.error('Error al enviar alerta:', error);
    throw error;
  }
};