export function saludo() {
  return 'Hola cliente';
}

export function suma(n1 = 8, n2 = 9) {
  return n1 + n2;
}
//transforma a $ chileno
export function formatearPrecio(valor) {
  if (typeof valor !== 'number' || Number.isNaN(valor)) {
    throw new Error('Valor inválido');
  }
  const entero = Math.round(valor);
  return '$' + entero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
//realzia descuento
export function aplicarDescuento(precio, porcentaje) {
  if (typeof precio !== 'number' || Number.isNaN(precio) || precio < 0) {
    throw new Error('Precio inválido');
  }
  if (typeof porcentaje !== 'number' || porcentaje < 0 || porcentaje > 100) {
    throw new Error('El porcentaje debe estar entre 0 y 100');
  }
  return precio * (1 - porcentaje / 100);
}

export function validarCorreo(correo) {
  if (!correo || typeof correo !== 'string') return false;
  const limpio = correo.trim().toLowerCase();
  const dominiosPermitidos = ['@gmail.com', '@duocuc.cl', '@profesor.cl'];
  return dominiosPermitidos.some((dom) => limpio.endsWith(dom));
}
//recibe lista de productos del carro y calcula monto
export function calcularResumenCarrito(items = [], porcentajeDescuento = 0, costoComuna = 3990) {
  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const totalConDescuento = aplicarDescuento(subtotal, porcentajeDescuento);
  const montoDescuento = subtotal - totalConDescuento;
  // Envío gratis en pedidos de más de $35.000
  const envio = subtotal >= 35000 || subtotal === 0 ? 0 : costoComuna;
  const total = totalConDescuento + envio;

  return {
    subtotal,
    porcentajeDescuento,
    montoDescuento,
    envio,
    total,
    totalItems: items.reduce((acc, item) => acc + item.cantidad, 0),
  };
}