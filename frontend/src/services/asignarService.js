// src/services/asignarService.js

const API_URL = 'http://localhost:3000/api/asignacion';

export const asignarRA = async ({ usuario_id, competencia_id, r_a_id }) => {
  try {
    const response = await fetch(`${API_URL}/r_a`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usuario_id, competencia_id, r_a_id })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.mensaje || 'Error al asignar RA');

    return { ok: true, mensaje: data.mensaje };
  } catch (error) {
    console.error('[asignarService] Error:', error.message);
    return { ok: false, mensaje: error.message };
  }
};
