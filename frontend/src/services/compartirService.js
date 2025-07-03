// src/services/compartirService.js

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/compartir'; // Ajusta si tu backend tiene una ruta base diferente

// 1️⃣ Subir acta (con URL del anexo)
export const subirActa = async (anexos) => {
  try {
    const response = await axios.post(`${API_URL}/subir`, { anexos });
    return response.data;
  } catch (error) {
    console.error('❌ Error al subir el acta:', error.response?.data || error.message);
    throw error;
  }
};

// 2️⃣ Compartir acta con otro instructor
export const compartirActa = async (id_acta, correo_destino, token) => {
  try {
    const response = await axios.post(`${API_URL}/compartir`, {
      id_acta,
      correo_destino
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error al compartir el acta:', error.response?.data || error.message);
    throw error;
  }
};

// 3️⃣ Obtener actas compartidas con el usuario actual
export const obtenerActasCompartidas = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/compartidas`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener actas compartidas:', error.response?.data || error.message);
    throw error;
  }
};
