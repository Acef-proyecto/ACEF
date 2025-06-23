import axios from 'axios';

const API_URL = 'http://localhost:3000/api/busqueda';

export const buscarFichaPrograma = async (ficha, programa) => {
  try {
    const params = {};
    if (ficha) params.ficha = ficha;
    if (programa) params.programa = programa;

    const response = await axios.get(`${API_URL}/buscar`, { params });
    return response.data;
  } catch (error) {
    console.error('Error en buscarFichaPrograma:', error);
    throw error.response?.data || { mensaje: 'Error al buscar ficha y programa' };
  }
};
