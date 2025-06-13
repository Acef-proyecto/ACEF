import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css';
import logo from '../assets/logo.png';

function LoginForm() {
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (role === 'instructor') {
      navigate('/instructor/acta');
    } else if (role === 'coordinador') {
      navigate('/coordinacion/inicio');
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
            <div className="input-group">
              <label htmlFor="role" className="label">Rol</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="select"
                required
              >
                <option value="" disabled>Seleccionar rol</option>
                <option value="instructor">Instructor</option>
                <option value="coordinador">Coordinador / Coordinación</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="usuario" className="label">Usuario</label>
              <input
                type="text"
                id="usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                autoComplete="username"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="contrasena" className="label">Contraseña</label>
              <input
                type="password"
                id="contrasena"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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