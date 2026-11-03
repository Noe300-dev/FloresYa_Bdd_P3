import { describe, it, expect } from 'vitest';
import {
  saludo,
  suma,
  formatearPrecio,
  aplicarDescuento,
  validarCorreo,
  calcularResumenCarrito
} from '../js/floresUtils';

describe('saludo', () => {
  it('Saluda al cliente', () => {
    expect(saludo()).toBe('Hola cliente');
  });
});

describe('Validacion suma', () => {
  it('Suma correcta', () => {
    expect(suma()).toBe(17);
    expect(suma(10, 5)).toBe(15);
  });
});

describe('formatearPrecio', () => {
  it('Formateo correcto con signo peso', () => {
    expect(formatearPrecio(1000)).toBe('$1.000');
    expect(formatearPrecio(29990)).toBe('$29.990');
    expect(formatearPrecio(0)).toBe('$0');
  });

  it('Lanza error con valor no numerico o NaN', () => {
    expect(() => formatearPrecio('abc')).toThrow();
    expect(() => formatearPrecio(NaN)).toThrow();
  });
});

describe('aplicarDescuento', () => {
  it('Calcula descuento correctamente', () => {
    expect(aplicarDescuento(1000, 0)).toBe(1000);
    expect(aplicarDescuento(1000, 15)).toBe(850);
    expect(aplicarDescuento(1000, 100)).toBe(0);
  });

  it('Lanza error con porcentajes fuera de rango', () => {
    expect(() => aplicarDescuento(1000, -10)).toThrow();
    expect(() => aplicarDescuento(1000, 120)).toThrow();
  });
});

describe('validarCorreo', () => {
  it('Acepta correos autorizados institucional o gmail', () => {
    expect(validarCorreo('profesor@duocuc.cl')).toBe(true);
    expect(validarCorreo('docente@profesor.cl')).toBe(true);
    expect(validarCorreo('cliente@gmail.com')).toBe(true);
  });

  it('Rechaza correos no permitidos', () => {
    expect(validarCorreo('invalido@yahoo.com')).toBe(false);
  });
});

describe('calcularResumenCarrito', () => {
  it('Aplica envio gratis sobre 35000', () => {
    const items = [{ precio: 20000, cantidad: 2 }];
    const resumen = calcularResumenCarrito(items, 0, 3990);
    expect(resumen.subtotal).toBe(40000);
    expect(resumen.envio).toBe(0);
    expect(resumen.total).toBe(40000);
  });
});
