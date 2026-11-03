package cl.floresya.dto;

import cl.floresya.model.ItemPedido;
import cl.floresya.model.Pedido;

import java.time.format.DateTimeFormatter;
import java.util.List;

/** Misma forma que el objeto "pedido" que ya usaban MisPedidos y ConfirmacionPago en el frontend. */
public record PedidoResponse(
        String id,
        String fecha,
        String estado,
        String cliente,
        String destinatario,
        String direccion,
        String comuna,
        String telefono,
        String dedicatoria,
        Integer total,
        ResumenResponse resumen,
        List<ItemResponse> items) {

    private static final DateTimeFormatter FORMATO_FECHA = DateTimeFormatter.ofPattern("d/M/yyyy");

    public record ItemResponse(Long id, Long florId, String codigo, String nombre,
                               Integer precio, Integer cantidad, String imagen) {
    }

    public record ResumenResponse(Integer subtotal, Integer porcentajeDescuento, Integer montoDescuento,
                                  Integer envio, Integer total, Integer totalItems) {
    }

    /** Debe llamarse dentro de una transacción (items y usuario son LAZY). */
    public static PedidoResponse de(Pedido p) {
        List<ItemResponse> items = p.getItems().stream().map(PedidoResponse::item).toList();
        int totalItems = p.getItems().stream().mapToInt(ItemPedido::getCantidad).sum();
        String cliente = p.getUsuario() != null ? p.getUsuario().getNombre() : "Cliente eliminado";
        return new PedidoResponse(
                p.getCodigo(),
                p.getFecha().format(FORMATO_FECHA),
                p.getEstado(),
                cliente,
                p.getDestinatario(),
                p.getDireccion() + ", " + p.getComuna(),
                p.getComuna(),
                p.getTelefono(),
                p.getDedicatoria(),
                p.getTotal(),
                new ResumenResponse(p.getSubtotal(), p.getPorcentajeDescuento(), p.getMontoDescuento(),
                        p.getEnvio(), p.getTotal(), totalItems),
                items);
    }

    private static ItemResponse item(ItemPedido i) {
        return new ItemResponse(i.getId(), i.getFlorId(), i.getCodigo(), i.getNombre(),
                i.getPrecio(), i.getCantidad(), i.getImagen());
    }
}
