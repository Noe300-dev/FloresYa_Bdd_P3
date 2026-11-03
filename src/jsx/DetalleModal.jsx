import React from 'react';
import { formatearPrecio } from '../js/floresUtils';

export default function DetalleModal({ flor, onClose, onAgregarAlCarrito }) {
  if (!flor) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-4 overflow-hidden">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold font-serif">{flor.nombre}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
          </div>
          <div className="modal-body p-4">
            <div className="row g-4">
              <div className="col-md-6">
                <img
                  src={flor.imagen}
                  alt={flor.nombre}
                  className="img-fluid rounded-4 shadow-sm w-100"
                  style={{ height: '320px', objectFit: 'cover' }}
                />
              </div>
              <div className="col-md-6 d-flex flex-column justify-content-between">
                <div>
                  <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill fw-semibold">
                    {flor.categoria}
                  </span>
                  <h3 className="fw-bold text-dark mt-2 mb-3">{formatearPrecio(flor.precio)}</h3>
                  <p className="text-secondary">{flor.descripcion}</p>

                  <div className="bg-light p-3 rounded-3 mb-3">
                    <h6 className="fw-bold text-dark mb-1">
                      <i className="bi bi-droplet-half text-primary me-2"></i>Cuidados recomendados:
                    </h6>
                    <small className="text-muted">{flor.cuidados}</small>
                  </div>

                  <div className="small text-muted mb-1">
                    <i className="bi bi-tag me-2"></i><strong>Ocasión:</strong> {flor.ocasion}
                  </div>
                  <div className="small text-muted">
                    <i className="bi bi-box-seam me-2"></i><strong>Stock disponible:</strong> {flor.stock} unidades
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top d-flex gap-2">
                  <button
                    className="btn btn-floral flex-grow-1"
                    onClick={() => {
                      onAgregarAlCarrito(flor, 1);
                      onClose();
                    }}
                    disabled={flor.stock <= 0}
                  >
                    <i className="bi bi-cart-plus me-1"></i> Agregar 1 al Carrito
                  </button>
                  <button className="btn btn-outline-secondary" onClick={onClose}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}