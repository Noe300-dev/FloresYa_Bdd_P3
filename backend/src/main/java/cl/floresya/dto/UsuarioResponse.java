package cl.floresya.dto;

import cl.floresya.model.Usuario;

/** Lo que el frontend puede ver de un usuario: nunca incluye la contraseña. */
public record UsuarioResponse(Long id, String nombre, String correo, String telefono, String rol) {

    public static UsuarioResponse de(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNombre(), u.getCorreo(), u.getTelefono(), u.getRol());
    }
}
