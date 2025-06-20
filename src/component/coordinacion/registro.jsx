import React, { useState } from 'react';
import { FaSignOutAlt, FaBook, FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaUserTag } from "react-icons/fa";
import logo from "../../assets/logo.png"
import "../../styles/coordinacion/registro.css";
import { useNavigate } from 'react-router-dom';

const Registro = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    rol: '',
    nombre: '',
    segundoNombre: '',
    apellido: '',
    segundoApellido: '',
    numero: '',
    correo: ''
  });
  const [errors, setErrors] = useState({});

  const roles = [
    { value: '', label: 'Seleccionar rol' },
    { value: 'coordinador', label: 'Coordinador' },
    { value: 'instructor', label: 'Instructor' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error si existe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.rol) newErrors.rol = 'Debe seleccionar un rol';
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!formData.numero.trim()) newErrors.numero = 'El número es requerido';
    else if (!/^\d{10}$/.test(formData.numero)) newErrors.numero = 'El número debe tener 10 dígitos';
    if (!formData.correo.trim()) newErrors.correo = 'El correo es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) newErrors.correo = 'Formato de correo inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Datos del formulario:', formData);
      alert('Usuario registrado exitosamente');
      // Aquí iría la lógica para enviar los datos al backend
    }
  };

  const handleCancel = () => {
    setFormData({
      rol: '',
      nombre: '',
      segundoNombre: '',
      apellido: '',
      segundoApellido: '',
      numero: '',
      correo: ''
    });
    setErrors({});
  };

  const navigate = useNavigate();

  return (
    <div className="pantalla">
      <header className="header">
        <button className="hamburguesa" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        {menuOpen && (
          <div className="menu">
            <button onClick={() => navigate('/')}>
              <FaSignOutAlt style={{ marginRight: "8px" }} />
              Cerrar sesión
            </button>
            <button>
              <FaBook style={{ marginRight: "8px" }} />
              Manual
            </button>
            <button onClick={() => navigate('/coordinacion/inicio')}>
              <FaArrowLeft style={{ marginRight: "8px" }} />
              Volver
            </button>
          </div>
        )}
        <div className="logo">
          <img src={logo} alt="Logo ACEF" className="logo-img" />
        </div>
      </header>

      <main className="main-content">
        <div className="registro-container">
          <div className="registro-header">
            <FaUser className="registro-icon" />
            <h1>Registro de Usuario</h1>
          </div>

          <div className="registro-form">
            {/* Selección de Rol */}
            <div className="form-group">
              <label htmlFor="rol">
                <FaUserTag className="input-icon" />
                Rol *
              </label>
              <select
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleInputChange}
                className={`form-input ${errors.rol ? 'error' : ''}`}
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {errors.rol && <span className="error-message">{errors.rol}</span>}
            </div>

            {/* Nombres */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">
                  <FaUser className="input-icon" />
                  Primer Nombre *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={`form-input ${errors.nombre ? 'error' : ''}`}
                  placeholder="Ingrese su primer nombre"
                />
                {errors.nombre && <span className="error-message">{errors.nombre}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="segundoNombre">
                  <FaUser className="input-icon" />
                  Segundo Nombre
                </label>
                <input
                  type="text"
                  id="segundoNombre"
                  name="segundoNombre"
                  value={formData.segundoNombre}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Ingrese su segundo nombre"
                />
              </div>
            </div>

            {/* Apellidos */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="apellido">
                  <FaUser className="input-icon" />
                  Primer Apellido *
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className={`form-input ${errors.apellido ? 'error' : ''}`}
                  placeholder="Ingrese su primer apellido"
                />
                {errors.apellido && <span className="error-message">{errors.apellido}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="segundoApellido">
                  <FaUser className="input-icon" />
                  Segundo Apellido
                </label>
                <input
                  type="text"
                  id="segundoApellido"
                  name="segundoApellido"
                  value={formData.segundoApellido}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Ingrese su segundo apellido"
                />
              </div>
            </div>

            {/* Número y Correo */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="numero">
                  <FaPhone className="input-icon" />
                  Número de Teléfono *
                </label>
                <input
                  type="tel"
                  id="numero"
                  name="numero"
                  value={formData.numero}
                  onChange={handleInputChange}
                  className={`form-input ${errors.numero ? 'error' : ''}`}
                  placeholder="3001234567"
                  maxLength="10"
                />
                {errors.numero && <span className="error-message">{errors.numero}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="correo">
                  <FaEnvelope className="input-icon" />
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  className={`form-input ${errors.correo ? 'error' : ''}`}
                  placeholder="usuario@ejemplo.com"
                />
                {errors.correo && <span className="error-message">{errors.correo}</span>}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                Limpiar
              </button>
              <button type="button" onClick={handleSubmit} className="btn-primary">
                Registrar Usuario
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Registro;