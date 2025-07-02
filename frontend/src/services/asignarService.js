import axios from 'axios';

const API_URL = 'http://localhost:3000/api/usuario';

export const asignarResultado = async ({ usuario_id, competencia_id, r_a_id, token }) => {
  if (!usuario_id || !competencia_id || !r_a_id) {
    throw new Error('Faltan datos obligatorios: usuario_id, competencia_id o r_a_id');
  }

  try {
    const response = await axios.post(
      `${API_URL}/r_a`,
      { usuario_id, competencia_id, r_a_id },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.mensaje) {
      throw new Error(error.response.data.mensaje);
    } else {
      throw new Error('Error al asignar Resultado de Aprendizaje');
    }
  }
};
