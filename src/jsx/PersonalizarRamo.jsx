import React, { useState } from 'react';
import { formatearPrecio } from '../js/floresUtils';
import '../css/Personalizar.css';

export default function PersonalizarRamo({ onAgregarAlCarrito }) {
  const [flor, setFlor] = useState('Rosas Rojas');
  const [tallos, setTallos] = useState('18');
  const [empaque, setEmpaque] = useState('Sombrerera de Lujo');
  const [fecha, setFecha] = useState('2026-10-10');
  const [horario, setHorario] = useState('10:00 a 14:00');
  const [dedicatoria, setDedicatoria] = useState('');
  const [agregado, setAgregado] = useState(false);

  // Precios dinámicos
  const preciosPorTallo = { 'Rosas Rojas': 1200, 'Rosas Rosadas': 1200, 'Tulipanes': 1600, 'Girasoles': 1800, 'Lirios': 2000 };
  const preciosEmpaque = { 'Sombrerera de Lujo': 6000, 'Papel Kraft con Rafia': 2500, 'Florero de Vidrio': 7500 };

  const costoTotal = (parseInt(tallos, 10) * (preciosPorTallo[flor] || 1200)) + (preciosEmpaque[empaque] || 3000);

  const handleSubmit = (e) => {
    e.preventDefault();
    const ramoCustom = {
      id: Date.now(),
      codigo: 'CUSTOM-' + Math.floor(100 + Math.random() * 900),
      nombre: `Ramo Personalizado: ${tallos} ${flor}`,
      categoria: 'Personalizado',
      precio: costoTotal,
      stock: 99,
      stockCritico: 5,
      imagen: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop&q=80',
      descripcion: `Presentación: ${empaque}. Fecha despacho: ${fecha} (${horario}). Tarjeta: "${dedicatoria || 'Sin dedicatoria'}"`
    };

    onAgregarAlCarrito(ramoCustom, 1);
    setAgregado(true);
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card card-personalizador p-4 p-md-5">
            <h2 className="fw-bold font-serif text-center mb-1">Diseña tu Ramo Exclusivo</h2>
            <p className="text-muted text-center mb-4">Crea una combinación única con flores frescas y dedicatoria personalizada</p>

            {agregado && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <i className="bi bi-check-circle-fill me-2"></i> ¡Ramo personalizado añadido exitosamente al carrito!
                <button type="button" className="btn-close" onClick={() => setAgregado(false)}></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Flor Base</label>
                  <select className="form-select" value={flor} onChange={(e) => setFlor(e.target.value)}>
                    <option value="Rosas Rojas">Rosas Rojas Ecuatorianas</option>
                    <option value="Rosas Rosadas">Rosas Rosadas Pastel</option>
                    <option value="Tulipanes">Tulipanes Holandeses</option>
                    <option value="Girasoles">Girasoles Silvestres</option>
                    <option value="Lirios">Lirios Aromáticos</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Cantidad de Tallos</label>
                  <select className="form-select" value={tallos} onChange={(e) => setTallos(e.target.value)}>
                    <option value="12">12 Tallos (Clásico)</option>
                    <option value="18">18 Tallos (Deluxe)</option>
                    <option value="24">24 Tallos (Premium)</option>
                    <option value="36">36 Tallos (Extraordinario)</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Tipo de Empaque</label>
                  <select className="form-select" value={empaque} onChange={(e) => setEmpaque(e.target.value)}>
                    <option value="Sombrerera de Lujo">Sombrerera Redonda de Lujo (+ $6.000)</option>
                    <option value="Papel Kraft con Rafia">Papel Kraft con Rafia Natural (+ $2.500)</option>
                    <option value="Florero de Vidrio">Florero de Vidrio Templado (+ $7.500)</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Fecha Despacho</label>
                  <input type="date" className="form-control" required value={fecha} onChange={(e) => setFecha(e.target.value)} />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Franja Horaria</label>
                  <select className="form-select" value={horario} onChange={(e) => setHorario(e.target.value)}>
                    <option value="10:00 a 14:00">Mañana (10:00 a 14:00 hrs)</option>
                    <option value="14:00 a 18:00">Tarde (14:00 a 18:00 hrs)</option>
                    <option value="18:00 a 21:00">Noche (18:00 a 21:00 hrs)</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Mensaje para la Tarjeta de Dedicatoria</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Escribe aquí las palabras que irán en la tarjeta..."
                    value={dedicatoria}
                    onChange={(e) => setDedicatoria(e.target.value)}
                  ></textarea>

                  {/* Vista Previa de la Tarjeta */}
                  <div className="mt-3">
                    <span className="small text-muted d-block mb-1">Vista Previa de la Tarjeta Impresa:</span>
                    <div className="preview-tarjeta">
                      <p className="fst-italic mb-0">"{dedicatoria || 'Aquí se verá tu dedicatoria especial...'}"</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap justify-content-between align-items-center bg-light p-4 rounded-4 mt-4">
                <div>
                  <span className="text-muted small d-block">Costo Estimado:</span>
                  <span className="fs-3 fw-bold text-danger">{formatearPrecio(costoTotal)}</span>
                </div>
                <button type="submit" className="btn btn-floral btn-lg px-4 mt-2 mt-sm-0">
                  <i className="bi bi-cart-check me-2"></i> Añadir Pedido al Carrito
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}