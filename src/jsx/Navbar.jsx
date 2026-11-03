import React from 'react';
import '../css/Navbar.css';

export default function Navbar({
  paginaActual,
  setPaginaActual,
  totalItemsCarrito,
  usuarioActual,
  onAbrirCarrito,
  onAbrirAuth,
  onCerrarSesion
}) {
  return (
    <>
      <div className="barra-anuncio">
        <i className="bi bi-truck me-2"></i>
        Despacho el mismo día en Santiago • ¡Envío 100% GRATIS en compras sobre $35.000!
      </div>

      <header className="navbar-floresya sticky-top">
        <div className="container d-flex justify-content-between align-items-center">
          <button
            onClick={() => setPaginaActual('inicio')}
            className="logo-brand border-0 bg-transparent p-0"
          >
            <i className="bi bi-flower1"></i> FloresYa
          </button>

          <nav className="d-none d-lg-flex align-items-center gap-1">
            <button
              onClick={() => setPaginaActual('inicio')}
              className={`nav-enlace ${paginaActual === 'inicio' ? 'activo' : ''}`}
            >
              Inicio
            </button>
            <button
              onClick={() => setPaginaActual('catalogo')}
              className={`nav-enlace ${paginaActual === 'catalogo' ? 'activo' : ''}`}
            >
              Flores & Ramos
            </button>
            <button
              onClick={() => setPaginaActual('ofertas')}
              className={`nav-enlace ${paginaActual === 'ofertas' ? 'activo' : ''}`}
            >
              <i className="bi bi-tag-fill me-1 text-danger"></i>Ofertas
            </button>
            <button
              onClick={() => setPaginaActual('personalizar')}
              className={`nav-enlace ${paginaActual === 'personalizar' ? 'activo' : ''}`}
            >
              Diseñar Ramo
            </button>
            <button
              onClick={() => setPaginaActual('mis-pedidos')}
              className={`nav-enlace ${paginaActual === 'mis-pedidos' ? 'activo' : ''}`}
            >
              Mis Pedidos
            </button>
            <button
              onClick={() => setPaginaActual('blog')}
              className={`nav-enlace ${paginaActual === 'blog' ? 'activo' : ''}`}
            >
              Blog
            </button>
            <button
              onClick={() => setPaginaActual('contacto')}
              className={`nav-enlace ${paginaActual === 'contacto' ? 'activo' : ''}`}
            >
              Contacto
            </button>

            {usuarioActual && usuarioActual.rol === 'Administrador' && (
              <button
                onClick={() => setPaginaActual('admin')}
                className="btn btn-sm btn-outline-danger ms-2 rounded-pill fw-semibold"
              >
                <i className="bi bi-shield-check me-1"></i> Panel Admin
              </button>
            )}
          </nav>

          <div className="d-flex align-items-center gap-2">
            <button
              onClick={onAbrirCarrito}
              className="btn btn-light border rounded-pill px-3 py-2 position-relative"
              aria-label="Ver Carrito"
            >
              <i className="bi bi-bag-heart fs-5 text-danger"></i>
              <span className="ms-1 fw-bold d-none d-sm-inline">Carrito</span>
              {totalItemsCarrito > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger badge-carrito">
                  {totalItemsCarrito}
                </span>
              )}
            </button>

            {usuarioActual ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle rounded-pill px-3 py-2"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle me-1"></i>
                  <span className="small">{usuarioActual.nombre.split(' ')[0]}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                  <li className="dropdown-header">
                    <strong className="d-block">{usuarioActual.nombre}</strong>
                    <small className="text-muted">{usuarioActual.correo}</small>
                    <div><span className="badge bg-secondary mt-1">{usuarioActual.rol}</span></div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={() => setPaginaActual('mis-pedidos')}>
                      <i className="bi bi-clock-history me-2"></i> Mis Pedidos
                    </button>
                  </li>
                  {usuarioActual.rol === 'Administrador' && (
                    <li>
                      <button className="dropdown-item" onClick={() => setPaginaActual('admin')}>
                        <i className="bi bi-gear me-2"></i> Mantenedores CRUD
                      </button>
                    </li>
                  )}
                  <li>
                    <button className="dropdown-item text-danger" onClick={onCerrarSesion}>
                      <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button
                onClick={onAbrirAuth}
                className="btn btn-floral btn-sm px-3 py-2 rounded-pill"
              >
                <i className="bi bi-person-fill me-1"></i> Ingresar
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}