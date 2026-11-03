import React from 'react';
import { formatearPrecio } from '../js/floresUtils';

export default function MisPedidos({ pedidos, setPaginaActual }) {
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold font-serif mb-1">Mis Pedidos</h1>
          <p className="text-muted mb-0">Historial y estado de entrega de tus compras realizadas</p>
        </div>
        <button className="btn btn-outline-danger rounded-pill" onClick={() => setPaginaActual('catalogo')}>
          Seguir Comprando
        </button>
      </div>

      {pedidos.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <i className="bi bi-box2-heart display-4 text-muted mb-3"></i>
          <h4 className="fw-bold text-secondary">Aún no has realizado pedidos</h4>
          <p className="text-muted">Cuando completes una compra podrás ver aquí el número de seguimiento y estado.</p>
          <div>
            <button className="btn btn-floral px-4" onClick={() => setPaginaActual('catalogo')}>
              Ver Catálogo
            </button>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {pedidos.map((ped) => (
            <div key={ped.id} className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-3">
                <div>
                  <span className="fw-bold text-danger fs-5 me-3">{ped.id}</span>
                  <span className="text-muted small"><i className="bi bi-calendar3 me-1"></i> {ped.fecha}</span>
                </div>
                <div>
                  <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                    <i className="bi bi-truck me-1"></i> {ped.estado}
                  </span>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-7">
                  <h6 className="fw-bold small text-muted text-uppercase mb-2">Artículos del Pedido</h6>
                  <ul className="list-unstyled mb-0">
                    {ped.items.map((it) => (
                      <li key={it.id} className="d-flex justify-content-between small py-1 border-bottom">
                        <span>{it.cantidad}x {it.nombre}</span>
                        <span className="fw-semibold">{formatearPrecio(it.precio * it.cantidad)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-5 border-start-md ps-md-4">
                  <h6 className="fw-bold small text-muted text-uppercase mb-2">Detalles de Entrega</h6>
                  <p className="small mb-1"><strong>Destinatario:</strong> {ped.destinatario}</p>
                  <p className="small mb-1"><strong>Dirección:</strong> {ped.direccion}</p>
                  {ped.dedicatoria && <p className="small text-muted fst-italic">"{ped.dedicatoria}"</p>}
                  <div className="d-flex justify-content-between fw-bold pt-2 border-top mt-2">
                    <span>Total Pagado:</span>
                    <span className="text-danger">{formatearPrecio(ped.resumen.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}