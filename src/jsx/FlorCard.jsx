import React from 'react';
import { formatearPrecio } from '../js/floresUtils';
import { useContador } from '../js/useContador';
import '../css/FlorCard.css';

export default function FlorCard({ flor, onAgregarAlCarrito, onVerDetalle }) {
  const { valor: cantidad, incrementar, decrementar } = useContador({
    inicial: 1,
    min: 1,
    max: flor.stock
  });

  const alertaStock = flor.stock <= flor.stockCritico;
  const sinStock = flor.stock <= 0;

  return (
    <div className="card h-100 card-flor-item">
      <div className="img-wrapper" onClick={() => onVerDetalle(flor)} style={{ cursor: 'pointer' }}>
        <img   src={flor.imagen}
  alt={flor.nombre}
  onError={(e) => {
    console.log("ERROR IMAGEN:", flor.nombre, flor.imagen);
  }}
  onLoad={() => {
    console.log("IMAGEN CARGADA:", flor.nombre, flor.imagen);
  }}/>
        <span className="position-absolute top-0 start-0 m-3 badge bg-white text-dark shadow-sm">
          {flor.categoria}
        </span>
        {alertaStock && !sinStock && (
          <span className="position-absolute top-0 end-0 m-3 badge-stock-alerta shadow-sm">
            <i className="bi bi-exclamation-triangle-fill me-1"></i> ¡Solo {flor.stock} en stock!
          </span>
        )}
        {sinStock && (
          <span className="position-absolute top-0 end-0 m-3 badge bg-secondary">
            Agotado
          </span>
        )}
      </div>

      <div className="card-body d-flex flex-column justify-content-between p-3">
        <div>
          <h5
            className="card-title fw-bold text-truncate mb-1"
            title={flor.nombre}
            onClick={() => onVerDetalle(flor)}
            style={{ cursor: 'pointer' }}
          >
            {flor.nombre}
          </h5>
          <p className="card-text text-muted small mb-2" style={{ minHeight: '38px' }}>
            {flor.descripcion.length > 70 ? flor.descripcion.substring(0, 70) + '...' : flor.descripcion}
          </p>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fs-5 fw-bold text-dark">{formatearPrecio(flor.precio)}</span>
            <small className="text-muted">Stock: <strong>{flor.stock}</strong></small>
          </div>
        </div>

        <div>
          {!sinStock && (
            <div className="d-flex align-items-center justify-content-between mb-3 bg-light p-1 rounded-pill">
              <button
                className="btn btn-sm btn-outline-secondary rounded-circle"
                style={{ width: '28px', height: '28px', padding: 0 }}
                onClick={decrementar}
                disabled={cantidad <= 1}
                aria-label={`Disminuir ${flor.nombre}`}
              >
                -
              </button>
              <span className="fw-semibold px-2">{cantidad}</span>
              <button
                className="btn btn-sm btn-outline-secondary rounded-circle"
                style={{ width: '28px', height: '28px', padding: 0 }}
                onClick={incrementar}
                disabled={cantidad >= flor.stock}
                aria-label={`Aumentar ${flor.nombre}`}
              >
                +
              </button>
            </div>
          )}

          <div className="d-grid gap-2">
            <button
              className="btn btn-floral btn-sm"
              disabled={sinStock}
              onClick={() => onAgregarAlCarrito(flor, cantidad)}
            >
              <i className="bi bi-cart-plus me-1"></i> Agregar al Carrito
            </button>
            <button
              className="btn btn-light btn-sm text-muted"
              onClick={() => onVerDetalle(flor)}
            >
              Ver detalle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}