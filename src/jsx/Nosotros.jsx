import React from 'react';

export default function Nosotros() {
  return (
    <div className="container py-4">
      <div className="text-center mb-5">
        <h1 className="fw-bold font-serif">Sobre FloresYa</h1>
        <p className="text-muted">Artesanía botánica y pasión por los detalles</p>
      </div>

      <div className="row align-items-center g-5">
        <div className="col-lg-6">
          <h2 className="fw-bold font-serif mb-3">Nuestra Filosofía</h2>
          <p className="text-secondary">
            En FloresYa creemos que cada flor cuenta una historia. Trabajamos de la mano con agricultores de la zona central de Chile, garantizando que cada tallo sea cosechado en su momento óptimo de apertura.
          </p>
          <p className="text-secondary">
            Desde ramos clásicos de rosas rojas hasta arreglos contemporáneos con flores silvestres, cuidamos la temperatura, la hidratación y el empaque para que lleguen impecables a su destino.
          </p>
        </div>
        <div className="col-lg-6">
          <img
            src="https://images.unsplash.com/photo-1520763185298-1b434c919102?w=600&auto=format&fit=crop&q=80"
            alt="Taller Floral"
            className="img-fluid rounded-4 shadow"
          />
        </div>
      </div>
    </div>
  );
}