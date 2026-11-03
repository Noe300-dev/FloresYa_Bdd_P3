package cl.floresya.dto;

import jakarta.validation.constraints.NotBlank;

public record CambioRolRequest(@NotBlank(message = "El rol es obligatorio") String rol) {
}
