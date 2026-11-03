import React, { useState } from 'react';
import { formatearPrecio, calcularResumenCarrito } from '../js/floresUtils';
import { comunasSantiago } from '../js/floresData';
import '../css/Carrito.css';

export default function Carrito({
  carrito,
  isOpen,
  onClose,
  onModificarCantidad,
  onEliminarItem,
  onVaciarCarrito,
  onFinalizarCompra
}) {
  const [cupon, setCupon] = useState('');
  const [porcentajeDescuento, setPorcentajeDescuento] = useState(0);
  const [mensajeCupon, setMensajeCupon] = useState('');
  const [comunaSeleccionada, setComunaSeleccionada] = useState(comunasSantiago[0]);
  const [modalCheckout, setModalCheckout] = useState(false);

  // Formulario Checkout
  const [nombreDestinatario, setNombreDestinatario] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefonoContacto, setTelefonoContacto] = useState('');
  const [dedicatoria, setDedicatoria] = useState('');

  if (!isOpen) return null;

  const resumen = calcularResumenCarrito(carrito, porcentajeDescuento, comunaSeleccionada.tarifa);

  const aplicarCupon = (e) => {
    e.preventDefault();
    const codigo = cupon.trim().toUpperCase();
    if (codigo === 'FLOR15') {
      setPorcentajeDescuento(15);
      setMensajeCupon('¡Cupón 15% de Descuento aplicado!');
    } else if (codigo === 'DUOC20') {
      setPorcentajeDescuento(20);
      setMensajeCupon('¡Cupón Duoc UC 20% aplicado!');
    } else {
      setPorcentajeDescuento(0);
      setMensajeCupon('Cupón inválido. Prueba con FLOR15 o DUOC20');
    }
  };

  const handlePagar = (e) => {
    e.preventDefault();
    if (!nombreDestinatario.trim() || !direccion.trim()) {
      alert('Por favor ingresa destinatario y dirección de entrega.');
      return;
    }

    const nuevoPedido = {
      id: 'PED-' + Math.floor(100000 + Math.random() * 900000),
      fecha: new Date().toLocaleDateString('es-CL'),
      items: [...carrito],
      resumen,
      destinatario: nombreDestinatario,
      direccion: `${direccion}, ${comunaSeleccionada.nombre}`,
      telefono: telefonoContacto,
      dedicatoria,
      estado: 'En preparación',
      comuna: comunaSeleccionada.nombre,
      direccionCalle: direccion,
      cupon: porcentajeDescuento > 0 ? cupon.trim().toUpperCase() : ''
    };

    onFinalizarCompra(nuevoPedido);
    setModalCheckout(false);
    onClose();
  };

  return (
    <div className="modal fade show d-block modal-carrito-backdrop" tabIndex="-1">
      <div className="modal-dialog modal-dialog-scrollable modal-lg">
        <div className="modal-content border-0 rounded-4 shadow">
          <div className="modal-header border-bottom py-3">
            <h5 className="modal-title fw-bold font-serif">
              <i className="bi bi-bag-heart text-danger me-2"></i> Tu Carrito de Flores
            </h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
          </div>

          <div className="modal-body p-4">
            {carrito.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-cart-x display-3 text-muted"></i>
                <h4 className="fw-bold mt-3 text-secondary">Tu carrito está vacío</h4>
                <p className="text-muted">Añade ramos o arreglos florales frescos para continuar.</p>
                <button className="btn btn-floral mt-2 px-4" onClick={onClose}>
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {/* Listado de Productos */}
                <div className="col-lg-7">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-semibold text-secondary">Productos ({resumen.totalItems})</span>
                    <button className="btn btn-sm btn-link text-danger text-decoration-none" onClick={onVaciarCarrito}>
                      <i className="bi bi-trash3 me-1"></i> Vaciar Carrito
                    </button>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    {carrito.map((item) => (
                      <div key={item.id} className="item-carrito-fila d-flex align-items-center gap-3">
                        <img src={item.imagen} alt={item.nombre} className="item-carrito-img" />
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-1 text-truncate" style={{ maxWidth: '210px' }}>{item.nombre}</h6>
                          <div className="text-muted small">{formatearPrecio(item.precio)} c/u</div>
                          <div className="d-flex align-items-center gap-2 mt-2">
                            <button
                              className="btn btn-sm btn-outline-secondary py-0 px-2"
                              onClick={() => onModificarCantidad(item.id, item.cantidad - 1)}
                            >
                              -
                            </button>
                            <span className="fw-bold small">{item.cantidad}</span>
                            <button
                              className="btn btn-sm btn-outline-secondary py-0 px-2"
                              onClick={() => onModificarCantidad(item.id, item.cantidad + 1)}
                              disabled={item.cantidad >= item.stock}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold">{formatearPrecio(item.precio * item.cantidad)}</div>
                          <button
                            className="btn btn-link text-danger p-0 mt-2"
                            onClick={() => onEliminarItem(item.id)}
                            aria-label={`Eliminar ${item.nombre}`}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cupón */}
                  <form onSubmit={aplicarCupon} className="mt-4">
                    <label className="form-label small fw-semibold">Cupón de Descuento</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control text-uppercase"
                        placeholder="FLOR15 o DUOC20"
                        value={cupon}
                        onChange={(e) => setCupon(e.target.value)}
                      />
                      <button className="btn btn-outline-secondary" type="submit">Aplicar</button>
                    </div>
                    {mensajeCupon && (
                      <small className={`d-block mt-1 ${porcentajeDescuento > 0 ? 'text-success' : 'text-danger'}`}>
                        {mensajeCupon}
                      </small>
                    )}
                  </form>
                </div>

                {/* Resumen de Compra */}
                <div className="col-lg-5">
                  <div className="caja-resumen-pago">
                    <h5 className="fw-bold font-serif mb-3">Resumen de Compra</h5>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Comuna de Entrega</label>
                      <select
                        className="form-select form-select-sm"
                        value={comunaSeleccionada.nombre}
                        onChange={(e) => {
                          const com = comunasSantiago.find((c) => c.nombre === e.target.value);
                          if (com) setComunaSeleccionada(com);
                        }}
                      >
                        {comunasSantiago.map((c) => (
                          <option key={c.nombre} value={c.nombre}>
                            {c.nombre} (+{formatearPrecio(c.tarifa)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Subtotal:</span>
                      <span className="fw-semibold">{formatearPrecio(resumen.subtotal)}</span>
                    </div>

                    {resumen.porcentajeDescuento > 0 && (
                      <div className="d-flex justify-content-between mb-2 text-success small">
                        <span>Descuento ({resumen.porcentajeDescuento}%):</span>
                        <span className="fw-semibold">-{formatearPrecio(resumen.montoDescuento)}</span>
                      </div>
                    )}

                    <div className="d-flex justify-content-between mb-3 small">
                      <span className="text-muted">Despacho ({comunaSeleccionada.nombre}):</span>
                      <span>
                        {resumen.envio === 0 ? <strong className="text-success">¡GRATIS!</strong> : formatearPrecio(resumen.envio)}
                      </span>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <span className="fw-bold fs-5">Total:</span>
                      <span className="fw-bold fs-4 text-danger">{formatearPrecio(resumen.total)}</span>
                    </div>

                    <button
                      className="btn btn-floral w-100 py-3 fw-bold rounded-pill"
                      onClick={() => setModalCheckout(true)}
                    >
                      <i className="bi bi-credit-card-2-front me-2"></i> Continuar al Pago
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Checkout */}
      {modalCheckout && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header">
                <h5 className="modal-title fw-bold font-serif">Datos de Despacho & Pago</h5>
                <button type="button" className="btn-close" onClick={() => setModalCheckout(false)}></button>
              </div>
              <form onSubmit={handlePagar}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Nombre de quien recibe *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="Ej: Camila Valenzuela"
                      value={nombreDestinatario}
                      onChange={(e) => setNombreDestinatario(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Dirección exacta en {comunaSeleccionada.nombre} *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="Calle, número, depto / casa"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Teléfono de contacto</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+56 9 1234 5678"
                      value={telefonoContacto}
                      onChange={(e) => setTelefonoContacto(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Mensaje impreso en la tarjeta de regalo</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Escribe aquí tu dedicatoria especial..."
                      value={dedicatoria}
                      onChange={(e) => setDedicatoria(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="p-3 bg-light rounded-3 d-flex justify-content-between fw-bold">
                    <span>Monto Final a Transferir/Pagar:</span>
                    <span className="text-danger fs-5">{formatearPrecio(resumen.total)}</span>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setModalCheckout(false)}>
                    Volver
                  </button>
                  <button type="submit" className="btn btn-floral px-4">
                    Confirmar Pedido
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
