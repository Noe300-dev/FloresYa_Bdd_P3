import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import DetalleModal from './DetalleModal';
import Carrito from './Carrito';
import AuthModal from './AuthModal';

import Home from './Home';
import Catalogo from './Catalogo';
import Ofertas from './Ofertas';
import PersonalizarRamo from './PersonalizarRamo';
import MisPedidos from './MisPedidos';
import Blog from './Blog';
import Nosotros from './Nosotros';
import Contacto from './Contacto';
import AdminDashboard from './AdminDashboard';
import ConfirmacionPago from './ConfirmacionPago';

import { floresIniciales, blogInicial } from '../js/floresData';
import * as api from '../js/api';

export default function App() {
  const [paginaActual, setPaginaActual] = useState('inicio');

  // El catálogo viene de MySQL vía API. Si el backend no responde se muestra el catálogo local de respaldo.
  const [flores, setFlores] = useState(floresIniciales);
  const [apiOnline, setApiOnline] = useState(true);

  const [usuarios, setUsuarios] = useState([]); // solo se carga para administradores

  const [usuarioActual, setUsuarioActual] = useState(() => {
    const s = localStorage.getItem('floresya_sesion');
    if (!s || !api.getToken()) return null;
    try {
      return JSON.parse(s);
    } catch (e) {
      return null;
    }
  });

  const [carrito, setCarrito] = useState(() => {
    const s = localStorage.getItem('floresya_carrito');
    return s ? JSON.parse(s) : [];
  });

  const [pedidos, setPedidos] = useState([]); // pedidos del usuario con sesión
  const [pedidosAdmin, setPedidosAdmin] = useState([]); // todos los pedidos (admin)

  // Modales
  const [florDetalle, setFlorDetalle] = useState(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [authAbierto, setAuthAbierto] = useState(false);
  const [ultimoPedido, setUltimoPedido] = useState(null);

  const esAdmin = !!usuarioActual && usuarioActual.rol === 'Administrador';

  const cargarFlores = useCallback(async () => {
    try {
      setFlores(await api.getFlores());
      setApiOnline(true);
    } catch (e) {
      setApiOnline(false);
    }
  }, []);

  useEffect(() => {
    cargarFlores();
  }, [cargarFlores]);

  // Comprueba que la sesión guardada siga vigente en el servidor
  useEffect(() => {
    if (!api.getToken()) return;
    api.me().then(setUsuarioActual).catch(() => {});
  }, []);

  // Si el servidor responde 401, se cierra la sesión local
  useEffect(() => {
    const alExpirar = () => {
      api.logout();
      setUsuarioActual(null);
      setPaginaActual((p) => (p === 'admin' || p === 'mis-pedidos' ? 'inicio' : p));
    };
    window.addEventListener('floresya:sesion-expirada', alExpirar);
    return () => window.removeEventListener('floresya:sesion-expirada', alExpirar);
  }, []);

  // Datos que dependen de la sesión
  useEffect(() => {
    if (!usuarioActual) {
      setPedidos([]);
      setPedidosAdmin([]);
      setUsuarios([]);
      return;
    }
    api.getMisPedidos().then(setPedidos).catch(() => {});
    if (usuarioActual.rol === 'Administrador') {
      api.getUsuarios().then(setUsuarios).catch(() => {});
      api.getTodosPedidos().then(setPedidosAdmin).catch(() => {});
    }
  }, [usuarioActual && usuarioActual.id, usuarioActual && usuarioActual.rol]);

  useEffect(() => {
    localStorage.setItem('floresya_carrito', JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    if (usuarioActual) {
      localStorage.setItem('floresya_sesion', JSON.stringify(usuarioActual));
    } else {
      localStorage.removeItem('floresya_sesion');
    }
  }, [usuarioActual]);

  // Carrito handlers
  const agregarAlCarrito = (flor, cantidad = 1) => {
    setCarrito((prev) => {
      const idx = prev.findIndex((i) => i.id === flor.id);
      if (idx !== -1) {
        const nuevo = [...prev];
        const cant = Math.min(nuevo[idx].cantidad + cantidad, flor.stock);
        nuevo[idx] = { ...nuevo[idx], cantidad: cant };
        return nuevo;
      }
      return [...prev, { ...flor, cantidad }];
    });
  };

  const modificarCantidad = (id, nuevaCant) => {
    if (nuevaCant <= 0) {
      eliminarItem(id);
      return;
    }
    setCarrito((prev) => prev.map((it) => (it.id === id ? { ...it, cantidad: nuevaCant } : it)));
  };

  const eliminarItem = (id) => {
    setCarrito((prev) => prev.filter((it) => it.id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // Confirma la compra en el backend: valida stock, descuenta y guarda el pedido en MySQL
  const finalizarCompra = async (nuevoPedido) => {
    if (!usuarioActual) {
      setCarritoAbierto(false);
      setAuthAbierto(true);
      alert('Inicia sesión o regístrate para confirmar tu pedido.');
      return;
    }
    try {
      const creado = await api.crearPedido({
        items: carrito.map((i) => ({
          florId: String(i.codigo || '').startsWith('CUSTOM-') ? null : i.id,
          codigo: i.codigo,
          nombre: i.nombre,
          precio: i.precio,
          imagen: i.imagen,
          cantidad: i.cantidad
        })),
        destinatario: nuevoPedido.destinatario,
        direccion: nuevoPedido.direccionCalle,
        comuna: nuevoPedido.comuna,
        telefono: nuevoPedido.telefono,
        dedicatoria: nuevoPedido.dedicatoria,
        cupon: nuevoPedido.cupon
      });
      setPedidos((prev) => [creado, ...prev]);
      if (esAdmin) setPedidosAdmin((prev) => [creado, ...prev]);
      setUltimoPedido(creado);
      vaciarCarrito();
      setCarritoAbierto(false);
      setPaginaActual('confirmacion');
      cargarFlores(); // refresca el stock descontado por el servidor
    } catch (e) {
      alert(e.message);
      setCarritoAbierto(true);
    }
  };

  // Admin handlers (los errores se propagan al formulario del AdminDashboard)
  const agregarFlor = async (nueva) => {
    const creada = await api.crearFlor(nueva);
    setFlores((prev) => [creada, ...prev]);
  };

  const actualizarFlor = async (editada) => {
    const guardada = await api.actualizarFlor(editada.id, editada);
    setFlores((prev) => prev.map((f) => (f.id === guardada.id ? guardada : f)));
  };

  const eliminarFlor = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta flor?')) return;
    try {
      await api.eliminarFlor(id);
      setFlores((prev) => prev.filter((f) => f.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  const actualizarUsuario = async (editado) => {
    try {
      const guardado = await api.cambiarRolUsuario(editado.id, editado.rol);
      setUsuarios((prev) => prev.map((u) => (u.id === guardado.id ? guardado : u)));
      if (usuarioActual && usuarioActual.id === guardado.id) setUsuarioActual(guardado);
    } catch (e) {
      alert(e.message);
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Eliminar usuario?')) return;
    try {
      await api.eliminarUsuario(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  const cambiarEstadoPedido = async (codigo, estado) => {
    try {
      const actualizado = await api.cambiarEstadoPedido(codigo, estado);
      setPedidosAdmin((prev) => prev.map((p) => (p.id === actualizado.id ? actualizado : p)));
      setPedidos((prev) => prev.map((p) => (p.id === actualizado.id ? actualizado : p)));
      if (estado === 'Cancelado') cargarFlores(); // el stock vuelve al catálogo
    } catch (e) {
      alert(e.message);
    }
  };

  const cerrarSesion = () => {
    api.logout();
    setUsuarioActual(null);
    if (paginaActual === 'admin' || paginaActual === 'mis-pedidos') setPaginaActual('inicio');
  };

  const totalItems = carrito.reduce((acc, it) => acc + it.cantidad, 0);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar
        paginaActual={paginaActual}
        setPaginaActual={setPaginaActual}
        totalItemsCarrito={totalItems}
        usuarioActual={usuarioActual}
        onAbrirCarrito={() => setCarritoAbierto(true)}
        onAbrirAuth={() => setAuthAbierto(true)}
        onCerrarSesion={cerrarSesion}
      />

      <main className="flex-grow-1">
        {!apiOnline && (
          <div className="alert alert-warning rounded-0 mb-0 text-center small">
            <i className="bi bi-exclamation-triangle me-1"></i>
            Sin conexión con el servidor: se muestra el catálogo local. Enciende el backend y MySQL para comprar y administrar.
          </div>
        )}
        {paginaActual === 'inicio' && (
          <Home
            flores={flores}
            onAgregarAlCarrito={agregarAlCarrito}
            onVerDetalle={(f) => setFlorDetalle(f)}
            setPaginaActual={setPaginaActual}
          />
        )}

        {paginaActual === 'catalogo' && (
          <Catalogo
            flores={flores}
            onAgregarAlCarrito={agregarAlCarrito}
            onVerDetalle={(f) => setFlorDetalle(f)}
          />
        )}

        {paginaActual === 'ofertas' && (
          <Ofertas
            flores={flores}
            onAgregarAlCarrito={agregarAlCarrito}
            onVerDetalle={(f) => setFlorDetalle(f)}
          />
        )}

        {paginaActual === 'confirmacion' && (
          <ConfirmacionPago
            pedido={ultimoPedido}
            exito={!!ultimoPedido}
            setPaginaActual={setPaginaActual}
          />
        )}

        {paginaActual === 'personalizar' && (
          <PersonalizarRamo onAgregarAlCarrito={agregarAlCarrito} />
        )}

        {paginaActual === 'mis-pedidos' && (
          <MisPedidos pedidos={pedidos} setPaginaActual={setPaginaActual} />
        )}

        {paginaActual === 'blog' && <Blog articulos={blogInicial} />}

        {paginaActual === 'nosotros' && <Nosotros />}

        {paginaActual === 'contacto' && <Contacto />}

        {paginaActual === 'admin' && esAdmin && (
          <AdminDashboard
            flores={flores}
            onAgregarFlor={agregarFlor}
            onActualizarFlor={actualizarFlor}
            onEliminarFlor={eliminarFlor}
            usuarios={usuarios}
            onActualizarUsuario={actualizarUsuario}
            onEliminarUsuario={eliminarUsuario}
            pedidos={pedidosAdmin}
            onCambiarEstadoPedido={cambiarEstadoPedido}
          />
        )}
      </main>

      <Footer setPaginaActual={setPaginaActual} />

      {florDetalle && (
        <DetalleModal
          flor={florDetalle}
          onClose={() => setFlorDetalle(null)}
          onAgregarAlCarrito={agregarAlCarrito}
        />
      )}

      <Carrito
        carrito={carrito}
        isOpen={carritoAbierto}
        onClose={() => setCarritoAbierto(false)}
        onModificarCantidad={modificarCantidad}
        onEliminarItem={eliminarItem}
        onVaciarCarrito={vaciarCarrito}
        onFinalizarCompra={finalizarCompra}
      />

      <AuthModal
        isOpen={authAbierto}
        onClose={() => setAuthAbierto(false)}
        onLoginExitoso={(u) => setUsuarioActual(u)}
      />
    </div>
  );
}