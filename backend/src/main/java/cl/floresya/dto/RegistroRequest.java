package cl.floresya.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistroRequest(
        @NotBlank(message = "El nombre es obligatorio") @Size(max = 120) String nombre,
        @NotBlank(message = "El correo es obligatorio") @Size(max = 120) String correo,
        @Size(max = 30) String telefono,
        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 6, max = 72, message = "La contraseña debe tener al menos 6 caracteres") String password) {
}
