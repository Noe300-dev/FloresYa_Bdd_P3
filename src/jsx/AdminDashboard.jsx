import React, { useState } from 'react';
import { formatearPrecio } from '../js/floresUtils';
import '../css/Admin.css';

export default function AdminDashboard({
  flores,
  onAgregarFlor,
  onActualizarFlor,
  onEliminarFlor,
  usuarios,
  onActualizarUsuario,
  onEliminarUsuario,
  pedidos = [],
  onCambiarEstadoPedido
}) {
  const [tab, setTab] = useState('flores');
  const [modalFlor, setModalFlor] = useState(false);
  const [esEdicion, setEsEdicion] = useState(false);
  const [errorForm, setErrorForm] = useState('');

  const [formFlor, setFormFlor] = useState({
    id: null,
    codigo: '',
    nombre: '',
    categoria: 'Rosas',
    precio: 19990,
    stock: 10,
    stockCritico: 3,
    ocasion: 'Amor y Romance',
    imagen: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
    descripcion: '',
    cuidados: 'Cambiar agua regularmente'
  });

  const abrirNuevo = () => {
    setEsEdicion(false);
    setErrorForm('');
    const maxNum = flores.reduce((m, f) => Math.max(m, parseInt(String(f.codigo).replace(/\D/g, ''), 10) || 0), 0);
    setFormFlor({
      id: null,
      codigo: `FLOR-${String(maxNum + 1).padStart(3, '0')}`,
      nombre: '',
      categoria: 'Rosas',
      precio: 19990,
      stock: 10,
      stockCritico: 3,
      ocasion: 'Amor y Romance',
      imagen: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
      descripcion: '',
      cuidados: 'Cambiar agua regularmente'
    });
    setModalFlor(true);
  };

  const abrirEditar = (flor) => {
    setEsEdicion(true);
    setErrorForm('');
    setFormFlor({ ...flor });
    setModalFlor(true);
  };

  const handleGuardarFlor = async (e) => {
    e.preventDefault();
    setErrorForm('');
    try {
      if (esEdicion) {
        await onActualizarFlor(formFlor);
      } else {
        await onAgregarFlor(formFlor);
      }
      setModalFlor(false);
    } catch (err) {
      setErrorForm(err.message);
    }
  };

  const alternarRol = (u) => {
    const nuevoRol = u.rol === 'Administrador' ? 'Cliente' : 'Administrador';
    onActualizarUsuario({ ...u, rol: nuevoRol });
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold font-serif mb-1">Panel de Administración</h1>
          <p className="text-muted mb-0">Gestión de Catálogo, Alertas de Stock y Usuarios</p>
        </div>
        <div className="btn-group">
          <button
            className={`btn ${tab === 'flores' ? 'btn-danger' : 'btn-outline-secondary'}`}
            onClick={() => setTab('flores')}
          >
            <i className="bi bi-flower1 me-1"></i> Flores ({flores.length})
          </button>
          <button
            className={`btn ${tab === 'usuarios' ? 'btn-danger' : 'btn-outline-secondary'}`}
            onClick={() => setTab('usuarios')}
          >
            <i className="bi bi-people me-1"></i> Usuarios ({usuarios.length})
          </button>
          <button
            className={`btn ${tab === 'pedidos' ? 'btn-danger' : 'btn-outline-secondary'}`}
            onClick={() => setTab('pedidos')}
          >
            <i className="bi bi-box-seam me-1"></i> Pedidos ({pedidos.length})
          </button>
        </div>
      </div>

      {/* METRICAS */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="admin-card-stat">
            <span className="text-muted small">Total Catálogo</span>
            <span className="fs-3 fw-bold d-block text-dark">{flores.length} productos</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="admin-card-stat" style={{ borderLeftColor: '#e63946' }}>
            <span className="text-muted small">Alertas de Stock Crítico</span>
            <span className="fs-3 fw-bold d-block text-danger">
              {flores.filter((f) => f.stock <= f.stockCritico).length} productos
            </span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="admin-card-stat" style={{ borderLeftColor: '#4a7c59' }}>
            <span className="text-muted small">Usuarios Registrados</span>
            <span className="fs-3 fw-bold d-block text-success">{usuarios.length} cuentas</span>
          </div>
        </div>
      </div>

      {/* TAB FLORES */}
      {tab === 'flores' && (
        <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold font-serif mb-0">Mantenedor de Productos</h5>
            <button className="btn btn-floral btn-sm px-3" onClick={abrirNuevo}>
              <i className="bi bi-plus-lg me-1"></i> Nueva Flor / Ramo
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle tabla-admin">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {flores.map((f) => {
                  const critico = f.stock <= f.stockCritico;
                  return (
                    <tr key={f.id}>
                      <td><img src={f.imagen} alt="" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '8px' }} /></td>
                      <td className="fw-bold small">{f.codigo}</td>
                      <td>{f.nombre}</td>
                      <td><span className="badge bg-light text-dark border">{f.categoria}</span></td>
                      <td className="fw-semibold">{formatearPrecio(f.precio)}</td>
                      <td>{f.stock} u.</td>
                      <td>
                        {critico ? (
                          <span className="badge bg-danger">Stock Crítico</span>
                        ) : (
                          <span className="badge bg-success">Disponible</span>
                        )}
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => abrirEditar(f)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => onEliminarFlor(f.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB USUARIOS */}
      {tab === 'usuarios' && (
        <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
          <h5 className="fw-bold font-serif mb-3">Mantenedor de Cuentas de Usuario</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle tabla-admin">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td className="fw-bold">{u.nombre}</td>
                    <td>{u.correo}</td>
                    <td>{u.telefono || '-'}</td>
                    <td>
                      <span className={`badge ${u.rol === 'Administrador' ? 'bg-danger' : 'bg-primary'}`}>
                        {u.rol}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => alternarRol(u)}>
                        Alternar Rol
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => onEliminarUsuario(u.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB PEDIDOS */}
      {tab === 'pedidos' && (
        <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
          <h5 className="fw-bold font-serif mb-3">Gestión de Pedidos</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle tabla-admin">
              <thead>
                <tr>
                  <th>N° Pedido</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Destinatario</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.length === 0 && (
                  <tr><td colSpan="6" className="text-center text-muted py-4">Aún no hay pedidos</td></tr>
                )}
                {pedidos.map((p) => (
                  <tr key={p.id}>
                    <td className="fw-bold small">{p.id}</td>
                    <td>{p.fecha}</td>
                    <td>{p.cliente}</td>
                    <td>{p.destinatario}</td>
                    <td className="fw-semibold">{formatearPrecio(p.total)}</td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={p.estado}
                        disabled={p.estado === 'Cancelado'}
                        onChange={(e) => onCambiarEstadoPedido(p.id, e.target.value)}
                      >
                        <option value="En preparación">En preparación</option>
                        <option value="En camino">En camino</option>
                        <option value="Entregado">Entregado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL CREAR / EDITAR */}
      {modalFlor && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold font-serif">{esEdicion ? 'Editar Flor' : 'Registrar Flor'}</h5>
                <button type="button" className="btn-close" onClick={() => setModalFlor(false)}></button>
              </div>
              <form onSubmit={handleGuardarFlor}>
                <div className="modal-body p-4">
                  {errorForm && <div className="alert alert-danger py-2 small">{errorForm}</div>}
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Código</label>
                      <input type="text" className="form-control" required value={formFlor.codigo} onChange={(e) => setFormFlor({ ...formFlor, codigo: e.target.value })} />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label small fw-semibold">Nombre del Ramo / Flor</label>
                      <input type="text" className="form-control" required value={formFlor.nombre} onChange={(e) => setFormFlor({ ...formFlor, nombre: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Categoría</label>
                      <select className="form-select" value={formFlor.categoria} onChange={(e) => setFormFlor({ ...formFlor, categoria: e.target.value })}>
                        <option value="Rosas">Rosas</option>
                        <option value="Tulipanes">Tulipanes</option>
                        <option value="Girasoles">Girasoles</option>
                        <option value="Orquídeas">Orquídeas</option>
                        <option value="Ramos Mixtos">Ramos Mixtos</option>
                        <option value="Condolencias">Condolencias</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Precio ($ CLP)</label>
                      <input type="number" className="form-control" required value={formFlor.precio} onChange={(e) => setFormFlor({ ...formFlor, precio: parseFloat(e.target.value) || 0 })} />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small fw-semibold">Stock</label>
                      <input type="number" className="form-control" required value={formFlor.stock} onChange={(e) => setFormFlor({ ...formFlor, stock: parseInt(e.target.value, 10) || 0 })} />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small fw-semibold">Stock Crítico</label>
                      <input type="number" className="form-control" required value={formFlor.stockCritico} onChange={(e) => setFormFlor({ ...formFlor, stockCritico: parseInt(e.target.value, 10) || 0 })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">URL Imagen</label>
                      <input type="url" className="form-control" required value={formFlor.imagen} onChange={(e) => setFormFlor({ ...formFlor, imagen: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Descripción</label>
                      <textarea className="form-control" rows="2" required value={formFlor.descripcion} onChange={(e) => setFormFlor({ ...formFlor, descripcion: e.target.value })}></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setModalFlor(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-floral px-4">{esEdicion ? 'Guardar Cambios' : 'Registrar Flor'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}