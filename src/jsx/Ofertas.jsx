import React from 'react';
import FlorCard from './FlorCard';
import '../css/Catalogo.css';

// Flores con descuento simulado (oferta = true en datos o precio reducido)
const ofertasData = [
  {
    id: 1,
    codigo: 'FLOR-001',
    nombre: 'Ramo Pasión de 24 Rosas Rojas',
    categoria: 'Rosas',
    precio: 23990,
    precioOriginal: 29990,
    stock: 12,
    stockCritico: 4,
    imagen: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
    descripcion: 'Hermoso bouquet de 24 rosas rojas importadas de tallo largo, con follaje fresco de eucalipto.',
    cuidados: 'Cambiar agua cada 2 días, cortar tallos en diagonal 1 cm.',
    descuento: 20
  },
  {
    id: 3,
    codigo: 'FLOR-003',
    nombre: 'Ramo Sol Radiante de Girasoles',
    categoria: 'Girasoles',
    precio: 14990,
    precioOriginal: 19990,
    stock: 8,
    stockCritico: 3,
    imagen: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop&q=80',
    descripcion: '6 girasoles grandes seleccionados con margaritas silvestres y lazo de rafia natural.',
    cuidados: 'Requiere agua abundante y luz indirecta brillante.',
    descuento: 25
  },
  {
    id: 5,
    codigo: 'FLOR-005',
    nombre: 'Arreglo Silvestre Primaveral Mixto',
    categoria: 'Ramos Mixtos',
    precio: 17990,
    precioOriginal: 22990,
    stock: 14,
    stockCritico: 5,
    imagen: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop&q=80',
    descripcion: 'Combinación de gerberas, lisianthus, lirios y toques de lavanda silvestre perfumada.',
    cuidados: 'Retirar hojas sumergidas para evitar bacterias.',
    descuento: 22
  }
];

export default function Ofertas({ flores, onAgregarAlCarrito, onVerDetalle }) {
  // Usar flores del estado global si están disponibles, aplicar descuentos
  const productosOferta = ofertasData.map((oferta) => {
    const florReal = flores?.find((f) => f.id === oferta.id);
    return florReal
      ? { ...florReal, precioOriginal: oferta.precioOriginal, precio: oferta.precio, descuento: oferta.descuento }
      : oferta;
  });

  return (
    <div className="container py-5">
      {/* Banner de oferta */}
      <div className="bg-danger text-white rounded-4 p-4 mb-5 text-center shadow">
        <h1 className="fw-bold fs-2 mb-1">
          <i className="bi bi-tag-fill me-2"></i>Ofertas y Descuentos
        </h1>
        <p className="mb-2 fs-5">¡Flores frescas con hasta 25% de descuento! Solo por tiempo limitado.</p>
        <span className="badge bg-warning text-dark fs-6 px-3 py-2 rounded-pill">
          <i className="bi bi-clock me-1"></i>Válido esta semana
        </span>
      </div>

      {/* Cupones */}
      <div className="row g-3 mb-5">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-light-pink" style={{ background: '#fff0f3' }}>
            <div className="card-body text-center p-4">
              <i className="bi bi-gift-fill text-danger fs-1 mb-2"></i>
              <h5 className="fw-bold">Cupón FLOR15</h5>
              <p className="text-muted small mb-2">15% de descuento en tu próxima compra</p>
              <code className="fs-5 bg-danger text-white px-3 py-1 rounded-3">FLOR15</code>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 h-100" style={{ background: '#f0f7ff' }}>
            <div className="card-body text-center p-4">
              <i className="bi bi-percent text-primary fs-1 mb-2"></i>
              <h5 className="fw-bold">Cupón DUOC20</h5>
              <p className="text-muted small mb-2">20% de descuento especial estudiantes</p>
              <code className="fs-5 bg-primary text-white px-3 py-1 rounded-3">DUOC20</code>
            </div>
          </div>
        </div>
      </div>

      {/* Productos en oferta */}
      <h4 className="fw-bold mb-4 text-danger">
        <i className="bi bi-fire me-2"></i>Productos en Oferta
      </h4>
      <div className="row g-4">
        {productosOferta.map((flor) => (
          <div key={flor.id} className="col-sm-6 col-lg-4">
            <div className="position-relative">
              <span
                className="position-absolute top-0 start-0 badge bg-danger rounded-pill px-3 py-2 fs-6"
                style={{ zIndex: 10, margin: '10px' }}
              >
                -{flor.descuento}%
              </span>
              {flor.precioOriginal && (
                <span
                  className="position-absolute top-0 end-0 text-muted text-decoration-line-through small"
                  style={{ zIndex: 10, margin: '14px', background: 'rgba(255,255,255,0.8)', padding: '2px 6px', borderRadius: '6px' }}
                >
                  ${flor.precioOriginal.toLocaleString('es-CL')}
                </span>
              )}
              <FlorCard
                flor={flor}
                onAgregarAlCarrito={onAgregarAlCarrito}
                onVerDetalle={onVerDetalle}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Envío gratis */}
      <div className="alert alert-success mt-5 rounded-4 border-0 shadow-sm text-center" role="alert">
        <i className="bi bi-truck me-2 fs-5"></i>
        <strong>¡Envío 100% GRATIS</strong> en compras sobre <strong>$35.000</strong> — Despacho el mismo día en Santiago
      </div>
    </div>
  );
}
