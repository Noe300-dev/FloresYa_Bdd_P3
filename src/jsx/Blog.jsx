import React, { useState } from 'react';

export default function Blog({ articulos }) {
  const [articuloActivo, setArticuloActivo] = useState(null);

  return (
    <div className="container py-4">
      <div className="text-center mb-5">
        <h1 className="fw-bold font-serif">Blog Floral & Guías de Cuidado</h1>
        <p className="text-muted">Aprende los secretos profesionales de floristería para conservar la frescura de tus ramos</p>
      </div>

      <div className="row g-4">
        {articulos.map((art) => (
          <div key={art.id} className="col-md-6">
            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white d-flex flex-column justify-content-between">
              <div>
                <img
                  src={art.imagen}
                  alt={art.titulo}
                  style={{ height: '240px', width: '100%', objectFit: 'cover' }}
                />
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between text-muted small mb-2">
                    <span className="badge bg-danger-subtle text-danger px-2.5 py-1 rounded-pill">
                      <i className="bi bi-patch-check-fill me-1"></i> {art.autor}
                    </span>
                    <span><i className="bi bi-calendar3 me-1"></i> {art.fecha}</span>
                  </div>
                  <h4 className="fw-bold font-serif mt-2 mb-3">{art.titulo}</h4>
                  <p className="text-secondary small">{art.resumen}</p>
                </div>
              </div>

              <div className="px-4 pb-4">
                <button
                  className="btn btn-outline-danger btn-sm rounded-pill px-4 fw-semibold"
                  onClick={() => setArticuloActivo(art)}
                >
                  Leer artículo completo <i className="bi bi-arrow-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE LECTURA COMPLETA DEL ARTÍCULO */}
      {articuloActivo && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-scrollable modal-lg">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom py-3">
                <div>
                  <span className="badge bg-danger-subtle text-danger px-3 py-1 rounded-pill small mb-1">
                    Por {articuloActivo.autor}
                  </span>
                  <h5 className="modal-title fw-bold font-serif">{articuloActivo.titulo}</h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setArticuloActivo(null)}
                  aria-label="Cerrar"
                ></button>
              </div>

              <div className="modal-body p-4 p-md-5">
                <img
                  src={articuloActivo.imagen}
                  alt={articuloActivo.titulo}
                  className="img-fluid rounded-4 shadow-sm w-100 mb-4"
                  style={{ maxHeight: '340px', objectFit: 'cover' }}
                />

                <div className="article-body text-secondary" style={{ lineHeight: '1.8' }}>
                  {articuloActivo.secciones ? (
                    articuloActivo.secciones.map((sec, idx) => {
                      if (sec.tipo === 'intro') {
                        return (
                          <div key={idx} className="lead mb-4 text-dark fst-italic">
                            {sec.texto.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
                          </div>
                        );
                      }
                      if (sec.tipo === 'truco') {
                        return (
                          <div key={idx} className="card border-0 bg-light p-4 rounded-4 mb-4 shadow-sm">
                            <div className="d-flex align-items-center gap-3 mb-2">
                              <span
                                className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5"
                                style={{ width: '40px', height: '40px', minWidth: '40px' }}
                              >
                                {sec.numero}
                              </span>
                              <h5 className="fw-bold font-serif mb-0 text-dark">{sec.titulo}</h5>
                            </div>
                            <div className="mt-2 text-secondary">
                              {sec.texto.split('\n\n').map((parrafo, i) => (
                                <p key={i} className="mb-2">{parrafo}</p>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      if (sec.tipo === 'ritual') {
                        return (
                          <div key={idx} className="alert alert-warning border-0 p-4 rounded-4 mb-4">
                            <h5 className="fw-bold font-serif text-dark mb-2">
                              <i className="bi bi-sun text-warning me-2"></i>{sec.titulo}
                            </h5>
                            {sec.texto.split('\n').map((item, i) => (
                              <p key={i} className="mb-1 text-dark small">{item}</p>
                            ))}
                          </div>
                        );
                      }
                      if (sec.tipo === 'seccion') {
                        return (
                          <div key={idx} className="mb-4 pb-3 border-bottom">
                            <h5 className="fw-bold font-serif text-dark mb-2">
                              <i className="bi bi-sun text-warning me-2"></i>{sec.titulo}
                            </h5>
                            <div className="text-secondary">
                              {sec.texto.split('\n\n').map((parrafo, i) => (
                                <p key={i} className="mb-2">{parrafo}</p>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      if (sec.tipo === 'conclusion') {
                        return (
                          <div key={idx} className="p-4 rounded-4 border border-danger-subtle bg-danger-subtle bg-opacity-25 mb-4">
                            <h5 className="fw-bold font-serif text-danger mb-2">{sec.titulo}</h5>
                            <p className="text-dark mb-0">{sec.texto}</p>
                          </div>
                        );
                      }
                      return null;
                    })
                  ) : (
                    <p>{articuloActivo.resumen}</p>
                  )}
                </div>
              </div>

              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-floral px-4"
                  onClick={() => setArticuloActivo(null)}
                >
                  Cerrar Artículo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
