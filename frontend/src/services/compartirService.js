// src/services/compartirService.js

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/acta'; // Ajusta si tu backend tiene una ruta base diferente

// 1️⃣ Compartir un acta con otro instructor
export const compartirActa = async ({ id_acta, correo_destino }, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/compartir`,
      { id_acta, correo_destino },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error al compartir el acta:', error);
    throw error.response?.data || { mensaje: 'Error desconocido al compartir acta' };
  }
};

// 2️⃣ Obtener actas compartidas con el usuario actual
export const obtenerActasCompartidas = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/compartidas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener actas compartidas:', error);
    throw error.response?.data || { mensaje: 'Error desconocido al obtener actas compartidas' };
  }
};