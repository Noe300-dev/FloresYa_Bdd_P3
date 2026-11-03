import React from 'react';
import '../css/Footer.css';

export default function Footer({ setPaginaActual }) {
  return (
    <footer className="footer-floresya">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-4">
            <h3 className="font-serif text-white mb-3">
              <i className="bi bi-flower1 text-danger me-2"></i>FloresYa
            </h3>
            <p className="small text-secondary">
              Floristería boutique online en Santiago. Flores frescas cosechadas diariamente con despacho garantizado.
            </p>
            <div className="d-flex gap-3 fs-5 mt-3 text-secondary">
              <i className="bi bi-instagram"></i>
              <i className="bi bi-facebook"></i>
              <i className="bi bi-whatsapp"></i>
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="text-white fw-bold mb-3">Secciones</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><a href="#inicio" onClick={(e) => { e.preventDefault(); setPaginaActual('inicio'); }}>Inicio</a></li>
              <li><a href="#catalogo" onClick={(e) => { e.preventDefault(); setPaginaActual('catalogo'); }}>Catálogo</a></li>
              <li><a href="#personalizar" onClick={(e) => { e.preventDefault(); setPaginaActual('personalizar'); }}>Diseñar Ramo</a></li>
              <li><a href="#mis-pedidos" onClick={(e) => { e.preventDefault(); setPaginaActual('mis-pedidos'); }}>Mis Pedidos</a></li>
              <li><a href="#contacto" onClick={(e) => { e.preventDefault(); setPaginaActual('contacto'); }}>Contacto</a></li>
            </ul>
          </div>

          <div className="col-6 col-lg-3">
            <h6 className="text-white fw-bold mb-3">Cobertura Santiago</h6>
            <p className="small text-secondary mb-1"><i className="bi bi-geo-alt me-2"></i> Providencia, Las Condes, Santiago</p>
            <p className="small text-secondary mb-1"><i className="bi bi-clock me-2"></i> Lunes a Domingo: 08:30 a 20:00 hrs</p>
            <p className="small text-secondary"><i className="bi bi-telephone me-2"></i> +56 9 8765 4321</p>
          </div>
        </div>

        <div className="border-top border-secondary border-opacity-25 pt-3 text-center small text-secondary">
          Â© {new Date().getFullYear()} FloresYa Chile. Desarrollado con React & Bootstrap.
        </div>
      </div>
    </footer>
  );
}