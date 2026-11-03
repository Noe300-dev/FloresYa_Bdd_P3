package cl.floresya.controller;

import cl.floresya.dto.CambioEstadoRequest;
import cl.floresya.dto.PedidoRequest;
import cl.floresya.dto.PedidoResponse;
import cl.floresya.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    /** Confirmar compra (requiere sesión). */
    @PostMapping
    public ResponseEntity<PedidoResponse> crear(@Valid @RequestBody PedidoRequest req, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(req, auth.getName()));
    }

    /** Pedidos del usuario con sesión iniciada. */
    @GetMapping("/mis-pedidos")
    public List<PedidoResponse> misPedidos(Authentication auth) {
        return service.listarDeUsuario(auth.getName());
    }

    /** Todos los pedidos (solo ADMIN). */
    @GetMapping
    public List<PedidoResponse> todos() {
        return service.listarTodos();
    }

    /** Cambiar estado de un pedido (solo ADMIN). */
    @PutMapping("/{codigo}/estado")
    public PedidoResponse cambiarEstado(@PathVariable String codigo, @Valid @RequestBody CambioEstadoRequest req) {
        return service.cambiarEstado(codigo, req.estado());
    }
}
