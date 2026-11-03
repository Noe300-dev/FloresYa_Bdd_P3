package cl.floresya.controller;

import cl.floresya.dto.LoginRequest;
import cl.floresya.dto.RegistroRequest;
import cl.floresya.dto.UsuarioResponse;
import cl.floresya.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService service;

    public AuthController(UsuarioService service) {
        this.service = service;
    }

    /** Valida correo y contraseña y devuelve los datos del usuario (con su rol). */
    @PostMapping("/login")
    public UsuarioResponse login(@Valid @RequestBody LoginRequest req) {
        return service.login(req);
    }

    @PostMapping("/register")
    public ResponseEntity<UsuarioResponse> registrar(@Valid @RequestBody RegistroRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registrar(req));
    }

    /** Usuario de la sesión actual (el frontend lo usa para comprobar que su sesión sigue vigente). */
    @GetMapping("/me")
    public UsuarioResponse me(Authentication auth) {
        return service.perfil(auth.getName());
    }
}
