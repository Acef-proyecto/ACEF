import axios from "axios";

const API_URL = "http://localhost:3000/api/busqueda/"; // Cambia el puerto si tu backend usa otro

// 1️⃣ Obtener competencias según ficha y programa
export const obtenerCompetencias = async (ficha, programa) => {
  try {
    const response = await axios.get(`${API_URL}/competencias`, {
      params: { ficha, programa },
    });

    if (!Array.isArray(response.data)) {
      throw new Error("Formato inesperado al obtener competencias.");
    }

    return response.data;
  } catch (error) {
    console.error("Error al obtener competencias:", error);
    throw error;
  }
};

// 2️⃣ Obtener resultados de aprendizaje según competencia
export const obtenerResultados = async (competenciaId) => {
  try {
    const response = await axios.get(`${API_URL}/resultados`, {
      params: { competenciaId },
    });

    if (!Array.isArray(response.data)) {
      throw new Error("Formato inesperado al obtener resultados.");
    }

    // Verifica que cada resultado tenga descripción
    response.data.forEach(r => {
      if (!r.descripcion) {
        console.warn(`Resultado ${r.numeros_r_a} no tiene descripción.`);
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener resultados:", error);
    throw error;
  }
};

// 3️⃣ Obtener aprendices según ficha, programa, competencia y RA
export const obtenerAprendices = async (ficha, programa, competenciaId, resultadoId) => {
  try {
    const response = await axios.get(`${API_URL}/aprendices`, {
      params: { ficha, programa, competenciaId, resultadoId },
    });

    if (!Array.isArray(response.data)) {
      throw new Error("Formato inesperado al obtener aprendices.");
    }

    return response.data;
  } catch (error) {
    console.error("Error al obtener aprendices:", error);
    throw error;
  }
};
