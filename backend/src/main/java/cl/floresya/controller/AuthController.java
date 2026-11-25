package cl.floresya.controller;

import cl.floresya.dto.LoginRequest;
import cl.floresya.dto.RegistroRequest;
import cl.floresya.dto.UsuarioResponse;
import cl.floresya.security.JwtService;
import cl.floresya.security.UsuarioDetailsService;
import cl.floresya.service.UsuarioService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService service;
    private final AuthenticationManager authenticationManager;
    private final UsuarioDetailsService usuarioDetailsService;
    private final JwtService jwtService;

    public AuthController(
            UsuarioService service,
            AuthenticationManager authenticationManager,
            UsuarioDetailsService usuarioDetailsService,
            JwtService jwtService) {
        this.service = service;
        this.authenticationManager = authenticationManager;
        this.usuarioDetailsService = usuarioDetailsService;
        this.jwtService = jwtService;   
    }

    /** Valida correo y contraseña y devuelve el token JWT junto con los datos del usuario. */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.correo(), req.password()));

        UserDetails userDetails = usuarioDetailsService.loadUserByUsername(req.correo());
        String token = jwtService.generateToken(userDetails);
        UsuarioResponse usuario = service.perfil(req.correo());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "usuario", usuario));
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