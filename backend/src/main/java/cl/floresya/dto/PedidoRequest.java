package cl.floresya.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record PedidoRequest(
        @NotEmpty(message = "El pedido debe tener al menos un producto") @Valid List<ItemRequest> items,
        @NotBlank(message = "El nombre del destinatario es obligatorio") @Size(max = 120) String destinatario,
        @NotBlank(message = "La dirección es obligatoria") @Size(max = 140) String direccion,
        @NotBlank(message = "La comuna es obligatoria") String comuna,
        @Size(max = 30) String telefono,
        @Size(max = 500) String dedicatoria,
        @Size(max = 20) String cupon) {

    /**
     * florId: id del producto del catálogo (el precio y el nombre se leen de la base, no del cliente).
     * florId null = ramo personalizado, que se cobra con el precio calculado en el configurador.
     */
    public record ItemRequest(
            Long florId,
            @Size(max = 30) String codigo,
            @Size(max = 150) String nombre,
            Integer precio,
            @Size(max = 1000) String imagen,
            @NotNull(message = "La cantidad es obligatoria")
            @Min(value = 1, message = "La cantidad mínima es 1")
            @Max(value = 99, message = "La cantidad máxima por producto es 99") Integer cantidad) {
    }
}
