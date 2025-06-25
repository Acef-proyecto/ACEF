// src/services/asignacionService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/asignacion'; 

// Marcar competencia (resultado de aprendizaje) como evaluado
export const marcarComoEvaluado = async (usuario_id, competencia_id) => {
  try {
    const response = await axios.post(`${API_URL}/evaluar`, {
      usuario_id,
      competencia_id,
    });
    return response.data;
  } catch (error) {
    console.error('[Frontend - Error marcando como evaluado]', error);
    throw error;
  }
};
