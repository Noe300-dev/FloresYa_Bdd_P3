package cl.floresya.controller;

import cl.floresya.model.Flor;
import cl.floresya.service.FlorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Catálogo. Leer es público; crear, editar y eliminar requiere rol ADMIN (ver SecurityConfig). */
@RestController
@RequestMapping("/api/flores")
public class FlorController {

    private final FlorService service;

    public FlorController(FlorService service) {
        this.service = service;
    }

    @GetMapping
    public List<Flor> listar() {
        return service.listar();
    }

    @GetMapping("/stock-critico")
    public List<Flor> stockCritico() {
        return service.stockCritico();
    }

    @GetMapping("/{id}")
    public Flor obtener(@PathVariable Long id) {
        return service.obtener(id);
    }

    @PostMapping
    public ResponseEntity<Flor> crear(@Valid @RequestBody Flor flor) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(flor));
    }

    @PutMapping("/{id}")
    public Flor actualizar(@PathVariable Long id, @Valid @RequestBody Flor flor) {
        return service.actualizar(id, flor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
