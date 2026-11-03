import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contacto from '../jsx/Contacto';

describe('Formulario de Contacto', () => {
  it('Bloquea el envio si el correo no es institucional o Gmail', async () => {
    const user = userEvent.setup();
    render(<Contacto />);

    await user.type(screen.getByPlaceholderText(/Tu nombre y apellido/i), 'Alumno Duoc');
    await user.type(screen.getByPlaceholderText(/nombre@duocuc.cl/i), 'invalido@yahoo.com');
    await user.type(screen.getByPlaceholderText(/Escribe tu consulta aquí.../i), 'Consulta para cotización de flores');
    await user.click(screen.getByRole('button', { name: /Enviar Mensaje/i }));

    expect(screen.getByText(/Por favor ingresa un correo válido/i)).toBeTruthy();
  });
});