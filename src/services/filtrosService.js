// frontend/services/filtroService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api"; // Cambia el puerto si usas otro

// 1️⃣ Obtener competencias según ficha y programa
export const obtenerCompetencias = async (ficha, programa) => {
  try {
    const response = await axios.get(`${API_URL}/busqueda/competencias`, {
      params: { ficha, programa },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener competencias:", error);
    throw error;
  }
};

// 2️⃣ Obtener resultados de aprendizaje según competencia
export const obtenerResultados = async (competenciaId) => {
  try {
    const response = await axios.get(`${API_URL}/busqueda/resultados`, {
      params: { competenciaId },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener resultados:", error);
    throw error;
  }
};

// 3️⃣ Obtener aprendices según todos los filtros
export const obtenerAprendices = async (ficha, programa, competenciaId, resultadoId) => {
  try {
    const response = await axios.get(`${API_URL}/busqueda/aprendices`, {
      params: { ficha, programa, competenciaId, resultadoId },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener aprendices:", error);
    throw error;
  }
};
