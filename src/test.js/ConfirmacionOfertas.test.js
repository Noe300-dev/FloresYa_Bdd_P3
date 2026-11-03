import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmacionPago from '../jsx/ConfirmacionPago';
import Ofertas from '../jsx/Ofertas';
import { floresIniciales } from '../js/floresData';

// ─── ConfirmacionPago ────────────────────────────────────────────────────────

describe('ConfirmacionPago — Vista de éxito', () => {
  const pedidoMock = {
    id: 'PED-001',
    cliente: 'Juan Flores',
    total: 29990,
    comuna: 'Providencia',
    fecha: '13/10/2026'
  };

  it('Renderiza el título de confirmación exitosa', () => {
    render(<ConfirmacionPago pedido={pedidoMock} exito={true} setPaginaActual={() => {}} />);
    expect(screen.getByText(/Pedido Confirmado/i)).toBeTruthy();
  });

  it('Muestra el número de pedido en pantalla', () => {
    render(<ConfirmacionPago pedido={pedidoMock} exito={true} setPaginaActual={() => {}} />);
    expect(screen.getByText('PED-001')).toBeTruthy();
  });

  it('Muestra el nombre del cliente', () => {
    render(<ConfirmacionPago pedido={pedidoMock} exito={true} setPaginaActual={() => {}} />);
    expect(screen.getByText('Juan Flores')).toBeTruthy();
  });

  it('El botón "Ver Mis Pedidos" navega a mis-pedidos', async () => {
    const user = userEvent.setup();
    const mockNavegar = vi.fn();
    render(<ConfirmacionPago pedido={pedidoMock} exito={true} setPaginaActual={mockNavegar} />);
    await user.click(screen.getByRole('button', { name: /Ver Mis Pedidos/i }));
    expect(mockNavegar).toHaveBeenCalledWith('mis-pedidos');
  });

  it('El botón "Volver al Inicio" navega a inicio', async () => {
    const user = userEvent.setup();
    const mockNavegar = vi.fn();
    render(<ConfirmacionPago pedido={pedidoMock} exito={true} setPaginaActual={mockNavegar} />);
    await user.click(screen.getByRole('button', { name: /Volver al Inicio/i }));
    expect(mockNavegar).toHaveBeenCalledWith('inicio');
  });
});

describe('ConfirmacionPago — Vista de error', () => {
  it('Renderiza el título de error de pago cuando exito=false', () => {
    render(<ConfirmacionPago pedido={null} exito={false} setPaginaActual={() => {}} />);
    expect(screen.getByText(/Error en el Pago/i)).toBeTruthy();
  });

  it('Muestra las causas posibles del error', () => {
    render(<ConfirmacionPago pedido={null} exito={false} setPaginaActual={() => {}} />);
    expect(screen.getByText(/Fondos insuficientes/i)).toBeTruthy();
  });

  it('El botón "Contactar Soporte" navega a contacto', async () => {
    const user = userEvent.setup();
    const mockNavegar = vi.fn();
    render(<ConfirmacionPago pedido={null} exito={false} setPaginaActual={mockNavegar} />);
    await user.click(screen.getByRole('button', { name: /Contactar Soporte/i }));
    expect(mockNavegar).toHaveBeenCalledWith('contacto');
  });
});

// ─── Ofertas ─────────────────────────────────────────────────────────────────

describe('Ofertas — Vista de descuentos', () => {
  it('Renderiza el banner de Ofertas y Descuentos', () => {
    render(<Ofertas flores={floresIniciales} onAgregarAlCarrito={() => {}} onVerDetalle={() => {}} />);
    expect(screen.getByText(/Ofertas y Descuentos/i)).toBeTruthy();
  });

  it('Muestra los cupones disponibles FLOR15 y DUOC20', () => {
    render(<Ofertas flores={floresIniciales} onAgregarAlCarrito={() => {}} onVerDetalle={() => {}} />);
    expect(screen.getByText('FLOR15')).toBeTruthy();
    expect(screen.getByText('DUOC20')).toBeTruthy();
  });

  it('Muestra el mensaje de envío gratis', () => {
    render(<Ofertas flores={floresIniciales} onAgregarAlCarrito={() => {}} onVerDetalle={() => {}} />);
    expect(screen.getByText(/Envío 100% GRATIS/i)).toBeTruthy();
  });
});

// ─── floresData CRUD helpers ─────────────────────────────────────────────────

describe('floresData — Integridad de datos iniciales', () => {
  it('floresIniciales contiene al menos 6 productos', () => {
    expect(floresIniciales.length).toBeGreaterThanOrEqual(6);
  });

  it('Cada flor tiene id, nombre, precio y stock', () => {
    floresIniciales.forEach((flor) => {
      expect(flor.id).toBeDefined();
      expect(flor.nombre).toBeDefined();
      expect(typeof flor.precio).toBe('number');
      expect(typeof flor.stock).toBe('number');
    });
  });
});
