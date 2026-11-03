import React from 'react';

/**
 * ConfirmacionPago — Vista que muestra el resultado de una compra.
 * Props:
 *  - pedido: objeto del pedido (puede ser null si hubo error)
 *  - exito: boolean — true = pago exitoso, false = error
 *  - setPaginaActual: función para navegar
 */
export default function ConfirmacionPago({ pedido, exito = true, setPaginaActual }) {
  if (exito && pedido) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6">
            <div className="card border-0 shadow-lg rounded-4 text-center p-5">
              {/* Ícono éxito */}
              <div className="mb-4">
                <span
                  className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10"
                  style={{ width: 90, height: 90 }}
                >
                  <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
                </span>
              </div>

              <h2 className="fw-bold text-success mb-1">¡Pedido Confirmado!</h2>
              <p className="text-muted mb-4">Tu pedido fue procesado exitosamente 🌸</p>

              <div className="bg-light rounded-3 p-4 text-start mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">N° de Pedido</span>
                  <strong className="text-danger">{pedido.id}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Cliente</span>
                  <span>{pedido.cliente || 'Cliente FloresYa'}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Total pagado</span>
                  <strong>
                    ${Number(pedido.total || 0).toLocaleString('es-CL')}
                  </strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Comuna</span>
                  <span>{pedido.comuna || '—'}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted small">Fecha</span>
                  <span>{pedido.fecha || new Date().toLocaleDateString('es-CL')}</span>
                </div>
              </div>

              <div className="alert alert-success border-0 rounded-3 small mb-4">
                <i className="bi bi-envelope-check me-2"></i>
                Recibirás un correo de confirmación. El despacho se realizará el mismo día.
              </div>

              <div className="d-grid gap-2">
                <button
                  className="btn btn-floral rounded-pill py-2"
                  onClick={() => setPaginaActual('mis-pedidos')}
                >
                  <i className="bi bi-clock-history me-2"></i>Ver Mis Pedidos
                </button>
                <button
                  className="btn btn-outline-secondary rounded-pill py-2"
                  onClick={() => setPaginaActual('inicio')}
                >
                  <i className="bi bi-house me-2"></i>Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de Error de Pago
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card border-0 shadow-lg rounded-4 text-center p-5">
            {/* Ícono error */}
            <div className="mb-4">
              <span
                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10"
                style={{ width: 90, height: 90 }}
              >
                <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '3rem' }}></i>
              </span>
            </div>

            <h2 className="fw-bold text-danger mb-1">Error en el Pago</h2>
            <p className="text-muted mb-4">
              No pudimos procesar tu pedido. Por favor intenta nuevamente.
            </p>

            <div className="alert alert-danger border-0 rounded-3 small mb-4 text-start">
              <i className="bi bi-exclamation-triangle me-2"></i>
              <strong>Posibles causas:</strong>
              <ul className="mb-0 mt-1 ps-3">
                <li>Fondos insuficientes en la tarjeta</li>
                <li>Datos de pago incorrectos</li>
                <li>Tiempo de sesión expirado</li>
              </ul>
            </div>

            <div className="d-grid gap-2">
              <button
                className="btn btn-danger rounded-pill py-2"
                onClick={() => setPaginaActual('carrito')}
              >
                <i className="bi bi-arrow-repeat me-2"></i>Reintentar Pago
              </button>
              <button
                className="btn btn-outline-secondary rounded-pill py-2"
                onClick={() => setPaginaActual('contacto')}
              >
                <i className="bi bi-headset me-2"></i>Contactar Soporte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
