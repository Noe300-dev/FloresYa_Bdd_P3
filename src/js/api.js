// Cliente HTTP del backend Spring Boot de FloresYa.
// En desarrollo Vite redirige /api -> http://localhost:8080 (ver vite.config.js).
const BASE = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'floresya_token';

const aBase64 = (texto) => {
  const bytes = new TextEncoder().encode(texto);
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const logout = () => localStorage.removeItem(TOKEN_KEY);

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (auth && token) headers.Authorization = `Basic ${token}`;

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch (e) {
    throw new Error('No se pudo conectar con el servidor. Verifica que el backend (puerto 8080) y MySQL estén encendidos.');
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401 && auth && token) {
      window.dispatchEvent(new Event('floresya:sesion-expirada'));
    }
    throw new Error((data && (data.error || data.message)) || `Error ${res.status}`);
  }
  return data;
}

// ---------- Catálogo ----------
export const getFlores = () => request('/flores', { auth: false });
export const crearFlor = (flor) => request('/flores', { method: 'POST', body: flor });
export const actualizarFlor = (id, flor) => request(`/flores/${id}`, { method: 'PUT', body: flor });
export const eliminarFlor = (id) => request(`/flores/${id}`, { method: 'DELETE' });

// ---------- Autenticación ----------
export async function login(correo, password) {
  const usuario = await request('/auth/login', { method: 'POST', body: { correo, password }, auth: false });
  localStorage.setItem(TOKEN_KEY, aBase64(`${usuario.correo}:${password}`));
  return usuario;
}
export const registrar = (datos) => request('/auth/register', { method: 'POST', body: datos, auth: false });
export const me = () => request('/auth/me');

// ---------- Usuarios (admin) ----------
export const getUsuarios = () => request('/usuarios');
export const cambiarRolUsuario = (id, rol) => request(`/usuarios/${id}/rol`, { method: 'PUT', body: { rol } });
export const eliminarUsuario = (id) => request(`/usuarios/${id}`, { method: 'DELETE' });

// ---------- Pedidos ----------
export const crearPedido = (pedido) => request('/pedidos', { method: 'POST', body: pedido });
export const getMisPedidos = () => request('/pedidos/mis-pedidos');
export const getTodosPedidos = () => request('/pedidos');
export const cambiarEstadoPedido = (codigo, estado) =>
  request(`/pedidos/${encodeURIComponent(codigo)}/estado`, { method: 'PUT', body: { estado } });
