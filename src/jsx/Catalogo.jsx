import React, { useState, useEffect, useMemo } from 'react';
import FlorCard from './FlorCard';
import '../css/Catalogo.css';

const API_URL = 'https://tu-api.com/api/flores';

export default function Catalogo({ onAgregarAlCarrito, onVerDetalle }) {
  const [flores, setFlores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [categoria, setCategoria] = useState('Todas');
  const [ocasion, setOcasion] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('destacados');

  const categorias = ['Todas', 'Rosas', 'Tulipanes', 'Girasoles', 'Orquídeas', 'Ramos Mixtos', 'Condolencias'];
  const ocasiones = ['Todas', 'Amor y Romance', 'Cumpleaños', 'Aniversario', 'Agradecimiento', 'Condolencias'];

  useEffect(() => {
    const controller = new AbortController();

    async function obtenerFlores() {
      try {
        setCargando(true);
        setError(null);

        const respuesta = await fetch(API_URL, { signal: controller.signal });
        if (!respuesta.ok) {
          throw new Error(`Error ${respuesta.status}: no se pudo cargar el catálogo`);
        }

        const data = await respuesta.json();
        // Ajusta aquí si tu API devuelve { flores: [...] } o { data: [...] }
        setFlores(Array.isArray(data) ? data : data.flores ?? []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setCargando(false);
      }
    }

    obtenerFlores();
    return () => controller.abort();
  }, []);

  const floresFiltradas = useMemo(() => {
    return flores
      .filter((flor) => {
        const catOk = categoria === 'Todas' || flor.categoria === categoria;
        const ocOk = ocasion === 'Todas' || flor.ocasion === ocasion;
        const term = busqueda.toLowerCase();
        const searchOk =
          (flor.nombre ?? '').toLowerCase().includes(term) ||
          (flor.codigo ?? '').toLowerCase().includes(term) ||
          (flor.descripcion ?? '').toLowerCase().includes(term);
        return catOk && ocOk && searchOk;
      })
      .sort((a, b) => {
        if (orden === 'precio-asc') return a.precio - b.precio;
        if (orden === 'precio-desc') return b.precio - a.precio;
        if (orden === 'alfabetico') return (a.nombre ?? '').localeCompare(b.nombre ?? '');
        return 0;
      });
  }, [flores, categoria, ocasion, busqueda, orden]);

  if (cargando) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="text-muted mt-2">Cargando catálogo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger d-inline-block" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="catalogo-header text-center">
        <h1 className="fw-bold font-serif mb-2">Catálogo de Flores y Ramos</h1>
        <p className="text-secondary mb-0">Filtra por tipo de flor, ocasión especial o busca por nombre</p>
      </div>

      {/* BARRA DE FILTROS AVANZADA */}
      <div className="panel-filtros mb-4 shadow-sm">
        <div className="row g-3">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Buscar por flor, código..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select className="form-select bg-light" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              {categorias.map((c) => <option key={c} value={c}>Flor: {c}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select bg-light" value={ocasion} onChange={(e) => setOcasion(e.target.value)}>
              {ocasiones.map((o) => <option key={o} value={o}>Ocasión: {o}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select bg-light" value={orden} onChange={(e) => setOrden(e.target.value)}>
              <option value="destacados">Destacados</option>
              <option value="precio-asc">Precio: Menor a Mayor</option>
              <option value="precio-desc">Precio: Mayor a Menor</option>
              <option value="alfabetico">Nombre: A - Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* RESULTADOS */}
      {floresFiltradas.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-emoji-neutral fs-1 text-muted"></i>
          <h4 className="fw-bold mt-2">No encontramos coincidencias</h4>
          <p className="text-muted">Prueba restableciendo los filtros de búsqueda.</p>
          <button className="btn btn-outline-danger" onClick={() => { setCategoria('Todas'); setOcasion('Todas'); setBusqueda(''); }}>
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {floresFiltradas.map((flor) => (
            <div key={flor.id} className="col-md-6 col-lg-4">
              <FlorCard flor={flor} onAgregarAlCarrito={onAgregarAlCarrito} onVerDetalle={onVerDetalle} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}