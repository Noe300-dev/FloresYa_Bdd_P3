package cl.floresya.service;

import cl.floresya.dto.PedidoRequest;
import cl.floresya.dto.PedidoRequest.ItemRequest;
import cl.floresya.dto.PedidoResponse;
import cl.floresya.model.Flor;
import cl.floresya.model.ItemPedido;
import cl.floresya.model.Pedido;
import cl.floresya.model.Usuario;
import cl.floresya.repository.FlorRepository;
import cl.floresya.repository.PedidoRepository;
import cl.floresya.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class PedidoService {

    public static final List<String> ESTADOS = List.of("En preparación", "En camino", "Entregado", "Cancelado");

    /** Mismos cupones y tarifas que el frontend (floresData.js / Carrito.jsx), pero validados en el servidor. */
    private static final Map<String, Integer> CUPONES = Map.of("FLOR15", 15, "DUOC20", 20);
    private static final Map<String, Integer> TARIFAS_COMUNA = Map.of(
            "Providencia", 2990,
            "Las Condes", 3490,
            "Santiago Centro", 2990,
            "Ñuñoa", 2990,
            "Vitacura", 3990,
            "La Reina", 3990,
            "Maipú", 4990,
            "La Florida", 4500);
    private static final int ENVIO_GRATIS_DESDE = 35000;

    private final PedidoRepository pedidos;
    private final FlorRepository flores;
    private final UsuarioRepository usuarios;
    private final SecureRandom random = new SecureRandom();

    public PedidoService(PedidoRepository pedidos, FlorRepository flores, UsuarioRepository usuarios) {
        this.pedidos = pedidos;
        this.flores = flores;
        this.usuarios = usuarios;
    }

    /**
     * Crea el pedido: valida el stock, lo descuenta, recalcula precios, descuento y despacho en el
     * servidor y guarda todo en una sola transacción (si algo falla no queda nada a medias).
     */
    @Transactional
    public PedidoResponse crear(PedidoRequest req, String correoUsuario) {
        Usuario usuario = usuarios.findByCorreoIgnoreCase(correoUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sesión inválida"));

        Integer tarifa = TARIFAS_COMUNA.get(req.comuna());
        if (tarifa == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No despachamos a la comuna indicada");
        }

        String cupon = req.cupon() == null ? "" : req.cupon().trim().toUpperCase();
        int porcentaje = 0;
        if (!cupon.isEmpty()) {
            Integer p = CUPONES.get(cupon);
            if (p == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cupón inválido");
            }
            porcentaje = p;
        }

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setDestinatario(req.destinatario().trim());
        pedido.setDireccion(req.direccion().trim());
        pedido.setComuna(req.comuna());
        pedido.setTelefono(req.telefono());
        pedido.setDedicatoria(req.dedicatoria());
        pedido.setCupon(cupon.isEmpty() ? null : cupon);

        // Se procesan ordenados por id para tomar los bloqueos siempre en el mismo orden.
        List<ItemRequest> ordenados = req.items().stream()
                .sorted(Comparator.comparing(ItemRequest::florId, Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();

        int subtotal = 0;
        for (ItemRequest it : ordenados) {
            ItemPedido item = new ItemPedido();
            item.setCantidad(it.cantidad());

            if (it.florId() != null) {
                Flor flor = flores.findByIdForUpdate(it.florId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "El producto " + it.florId() + " ya no existe"));
                if (flor.getStock() < it.cantidad()) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT,
                            "Stock insuficiente de \"" + flor.getNombre() + "\" (disponible: " + flor.getStock() + ")");
                }
                flor.setStock(flor.getStock() - it.cantidad());
                item.setFlorId(flor.getId());
                item.setCodigo(flor.getCodigo());
                item.setNombre(flor.getNombre());
                item.setPrecio(flor.getPrecio());
                item.setImagen(flor.getImagen());
            } else {
                // Ramo personalizado: no existe en el catálogo, usa el precio del configurador.
                if (it.nombre() == null || it.nombre().isBlank() || it.precio() == null || it.precio() < 1) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ramo personalizado inválido");
                }
                item.setCodigo(it.codigo());
                item.setNombre(it.nombre());
                item.setPrecio(it.precio());
                item.setImagen(it.imagen());
            }

            subtotal += item.getPrecio() * item.getCantidad();
            pedido.agregarItem(item);
        }

        int montoDescuento = (int) Math.round(subtotal * porcentaje / 100.0);
        int envio = subtotal >= ENVIO_GRATIS_DESDE ? 0 : tarifa;

        pedido.setSubtotal(subtotal);
        pedido.setPorcentajeDescuento(porcentaje);
        pedido.setMontoDescuento(montoDescuento);
        pedido.setEnvio(envio);
        pedido.setTotal(subtotal - montoDescuento + envio);
        pedido.setCodigo(generarCodigo());

        return PedidoResponse.de(pedidos.save(pedido));
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarDeUsuario(String correo) {
        return pedidos.findByUsuarioCorreoIgnoreCaseOrderByIdDesc(correo).stream().map(PedidoResponse::de).toList();
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarTodos() {
        return pedidos.findAllByOrderByIdDesc().stream().map(PedidoResponse::de).toList();
    }

    @Transactional
    public PedidoResponse cambiarEstado(String codigo, String nuevoEstado) {
        if (!ESTADOS.contains(nuevoEstado)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado inválido: " + ESTADOS);
        }
        Pedido pedido = pedidos.findByCodigo(codigo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado"));

        boolean estabaCancelado = "Cancelado".equals(pedido.getEstado());
        if (estabaCancelado && !"Cancelado".equals(nuevoEstado)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Un pedido cancelado no puede reactivarse");
        }
        if (!estabaCancelado && "Cancelado".equals(nuevoEstado)) {
            // Al cancelar se devuelve el stock de los productos del catálogo.
            for (ItemPedido item : pedido.getItems()) {
                if (item.getFlorId() != null) {
                    flores.findByIdForUpdate(item.getFlorId())
                            .ifPresent(f -> f.setStock(f.getStock() + item.getCantidad()));
                }
            }
        }
        pedido.setEstado(nuevoEstado);
        return PedidoResponse.de(pedidos.save(pedido));
    }

    private String generarCodigo() {
        String codigo;
        do {
            codigo = "PED-" + (100000 + random.nextInt(900000));
        } while (pedidos.existsByCodigo(codigo));
        return codigo;
    }
}
