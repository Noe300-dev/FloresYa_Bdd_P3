import React from 'react';
import FlorCard from './FlorCard';

export default function Home({ flores, onAgregarAlCarrito, onVerDetalle, setPaginaActual }) {
  const destacadas = flores.slice(0, 6);

  return (
    <div className="container py-4">
      {/* HERO SECTION EN 2 COLUMNAS (Estilo ExperienciaYa) */}
      <section className="p-4 p-md-5 rounded-4 mb-5" style={{ background: 'linear-gradient(135deg, #fff0f3 0%, #fae1dd 100%)' }}>
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill fw-bold mb-3">
               Flores Frescas de Temporada
            </span>
            <h1 className="display-4 fw-bold font-serif text-dark mb-3">
              Envía sonrisas y momentos inolvidables
            </h1>
            <p className="lead text-secondary mb-4">
              Ramos de rosas de exportación, tulipanes holandeses y arreglos florales de autor confeccionados a mano para despacho inmediato en Santiago.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <button className="btn btn-floral btn-lg px-4" onClick={() => setPaginaActual('catalogo')}>
                Ver Catálogo Completo
              </button>
              <button className="btn btn-floral-outline btn-lg px-4" onClick={() => setPaginaActual('personalizar')}>
                Diseñar Ramo a Medida
              </button>
            </div>
          </div>
          <div className="col-lg-5 text-center">
            <img
              src="https://cdnx.jumpseller.com/envio-flores/image/47820617/WhatsApp_Image_2024-04-20_at_1.10.08_PM.jpeg?1713633079"
              alt="Flores"
              className="img-fluid rounded-4 shadow-lg"
              style={{ maxHeight: '360px', width: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="my-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold font-serif">¿Por qué comprar en FloresYa?</h2>
          <p className="text-muted">La diferencia está en la frescura y la dedicación en cada detalle</p>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 p-4 rounded-4 shadow-sm text-center bg-white">
              <div className="fs-1 text-danger mb-2"><i className="bi bi-flower2"></i></div>
              <h5 className="fw-bold">100% Flores Naturales</h5>
              <p className="text-muted small">Cosechadas el mismo día sin intermediarios para asegurar hasta 2 semanas de duración.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 p-4 rounded-4 shadow-sm text-center bg-white">
              <div className="fs-1 text-success mb-2"><i className="bi bi-clock-history"></i></div>
              <h5 className="fw-bold">Puntualidad Absoluta</h5>
              <p className="text-muted small">Elige tu franja horaria favorita y recibe notificación con foto al momento de la entrega.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 p-4 rounded-4 shadow-sm text-center bg-white">
              <div className="fs-1 text-primary mb-2"><i className="bi bi-heart-pulse"></i></div>
              <h5 className="fw-bold">Tarjeta Dedicatoria de Regalo</h5>
              <p className="text-muted small">Personaliza un mensaje impreso en alta calidad sin costo adicional.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold font-serif mb-1">Ramos Más Pedidos de la Semana</h2>
            <p className="text-muted mb-0">Selección de favoritos disponibles hoy</p>
          </div>
          <button className="btn btn-outline-danger rounded-pill px-4" onClick={() => setPaginaActual('catalogo')}>
            Ver Catálogo <i className="bi bi-arrow-right ms-1"></i>
          </button>
        </div>

        <div className="row g-4">
          {destacadas.map((flor) => (
            <div key={flor.id} className="col-md-6 col-lg-4">
              <FlorCard flor={flor} onAgregarAlCarrito={onAgregarAlCarrito} onVerDetalle={onVerDetalle} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}