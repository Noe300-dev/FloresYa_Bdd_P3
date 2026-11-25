package cl.floresya.dto;

import jakarta.validation.constraints.NotBlank;

/** Token de identidad (credential) que entrega el botón "Iniciar sesión con Google". */
public record GoogleLoginRequest(@NotBlank(message = "Falta el token de Google") String idToken) {
}
