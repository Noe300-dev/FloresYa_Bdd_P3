import React, { useState } from 'react';
import { validarCorreo } from '../js/floresUtils';
import * as api from '../js/api';
import '../css/Auth.css';

export default function AuthModal({ isOpen, onClose, onLoginExitoso }) {
  const [modo, setModo] = useState('login');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const usuario = await api.login(correo.trim().toLowerCase(), password);
      setExito(`¡Bienvenido/a ${usuario.nombre}!`);
      setTimeout(() => {
        onLoginExitoso(usuario);
        onClose();
      }, 600);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError('');

    const correoLimpio = correo.trim().toLowerCase();

    if (!validarCorreo(correoLimpio)) {
      setError('Correo no permitido. Debe pertenecer a @duocuc.cl, @profesor.cl o @gmail.com');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await api.registrar({ nombre: nombre.trim(), correo: correoLimpio, telefono: telefono.trim(), password });
      const usuario = await api.login(correoLimpio, password);
      setExito('¡Registro exitoso! Iniciando sesión...');
      setTimeout(() => {
        onLoginExitoso(usuario);
        onClose();
      }, 600);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content auth-modal-card shadow">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold font-serif">
              {modo === 'login' ? 'Acceso a FloresYa' : 'Registro de Cliente'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            {exito && <div className="alert alert-success py-2 small">{exito}</div>}

            {modo === 'login' ? (
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="ejemplo@duocuc.cl o @gmail.com"
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                  />
                  <div className="form-text small">Admin demo: admin@gmail.com / 123456</div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-floral w-100 py-2 rounded-pill mt-2">
                  Ingresar
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegistro}>
                <div className="mb-2">
                  <label className="form-label small fw-semibold">Nombre Completo</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-semibold">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="usuario@duocuc.cl"
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-semibold">Teléfono</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+56 9 1234 5678"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-semibold">Contraseña (mínimo 6 car.)</label>
                  <input
                    type="password"
                    className="form-control"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Confirmar Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    required
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-floral w-100 py-2 rounded-pill">
                  Crear Cuenta
                </button>
              </form>
            )}

            <div className="text-center mt-3 pt-3 border-top">
              {modo === 'login' ? (
                <small className="text-muted">
                  ¿Aún no tienes cuenta?{' '}
                  <button
                    type="button"
                    className="btn btn-link p-0 small text-danger fw-semibold"
                    onClick={() => { setModo('registro'); setError(''); }}
                  >
                    Regístrate aquí
                  </button>
                </small>
              ) : (
                <small className="text-muted">
                  ¿Ya tienes cuenta?{' '}
                  <button
                    type="button"
                    className="btn btn-link p-0 small text-danger fw-semibold"
                    onClick={() => { setModo('login'); setError(''); }}
                  >
                    Inicia sesión
                  </button>
                </small>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}