import axios from 'axios';

export const obtenerIdInstructorPorCorreo = async (correo, token) => {
  try {
    const response = await axios.get(`/api/usuario/id/${correo}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.id_usuario;
  } catch (error) {
    console.error('[instructorService] Error al obtener ID del instructor:', error);
    if (error.response && error.response.data && error.response.data.mensaje) {
      throw new Error(error.response.data.mensaje);
    } else {
      throw new Error('No se pudo obtener el ID del instructor.');
    }
  }
};
