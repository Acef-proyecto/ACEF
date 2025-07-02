import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css';
import logo from '../assets/logo.png';
import { loginUsuario } from '../services/loginService';

function LoginForm() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await loginUsuario({
        correo,          // ← minúsculas, como lo espera el backend
        contrasena       // ← minúsculas
      });

      // Guardar token y usuario en localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));

      const rol = response.usuario.rol;

      // Redirección según el rol
      if (rol === 'instructor') {
        navigate('/instructor/acta');
      } else if (rol === 'coordinador') {
        navigate('/coordinacion/inicio');
      } else {
        navigate('/'); // ruta por defecto
      }

    } catch (err) {
      console.error("❌ Error en login:", err);
      setError(err.mensaje || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="pantalla">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="logo">
            <img
              src={logo}
              alt="Logo"
              className="logo-img"
              style={{ width: '200px', height: '200px' }}
            />
          </div>

          <div className="form-body">
            {error && <p className="error">{error}</p>}

            <div className="input-group">
              <label htmlFor="correo" className="label">Correo</label>
              <input
                type="email"
                id="correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="input"
                autoComplete="email"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="contrasena" className="label">Contraseña</label>
              <input
                type="password"
                id="contrasena"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="input"
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className="button">
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
