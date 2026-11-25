package cl.floresya.controller;

import cl.floresya.dto.GoogleLoginRequest;
import cl.floresya.dto.LoginRequest;
import cl.floresya.dto.RegistroRequest;
import cl.floresya.dto.UsuarioResponse;
import cl.floresya.model.Usuario;
import cl.floresya.repository.UsuarioRepository;
import cl.floresya.security.JwtService;
import cl.floresya.security.UsuarioDetailsService;
import cl.floresya.service.UsuarioService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import jakarta.validation.Valid;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService service;
    private final AuthenticationManager authenticationManager;
    private final UsuarioDetailsService usuarioDetailsService;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    /** Mismos dominios que permite el registro normal. */
    private static final List<String> DOMINIOS_PERMITIDOS = List.of("@gmail.com", "@duocuc.cl", "@profesor.cl");

    @Value("${google.client.id}")
    private String googleClientId;

    public AuthController(
            UsuarioService service,
            AuthenticationManager authenticationManager,
            UsuarioDetailsService usuarioDetailsService,
            JwtService jwtService,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {
        this.service = service;
        this.authenticationManager = authenticationManager;
        this.usuarioDetailsService = usuarioDetailsService;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
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

    /**
     * Inicio de sesión con Google: verifica el ID token con Google, crea la cuenta (rol Cliente)
     * si el correo no existe y devuelve el mismo JWT y usuario que el login normal.
     */
    @PostMapping("/google")
    public ResponseEntity<Map<String, Object>> loginConGoogle(@Valid @RequestBody GoogleLoginRequest req) {
        GoogleIdToken idToken;
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();
            idToken = verifier.verify(req.idToken());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No se pudo validar el token de Google.");
        }
        if (idToken == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token de Google inválido o expirado.");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        if (!Boolean.TRUE.equals(payload.getEmailVerified())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "El correo de Google no está verificado.");
        }

        String correo = payload.getEmail().trim().toLowerCase();
        String nombre = payload.get("name") != null ? (String) payload.get("name") : correo;

        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(correo).orElse(null);
        if (usuario == null) {
            if (DOMINIOS_PERMITIDOS.stream().noneMatch(correo::endsWith)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Correo no permitido. Debe pertenecer a @duocuc.cl, @profesor.cl o @gmail.com");
            }
            usuario = new Usuario();
            usuario.setNombre(nombre.length() > 120 ? nombre.substring(0, 120) : nombre);
            usuario.setCorreo(correo);
            // La columna password es obligatoria: se guarda un hash de una clave aleatoria que nadie conoce.
            usuario.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            usuario.setRol(Usuario.ROL_CLIENTE);
            usuario = usuarioRepository.save(usuario);
        }

        UserDetails userDetails = usuarioDetailsService.loadUserByUsername(usuario.getCorreo());
        String token = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "usuario", UsuarioResponse.de(usuario)));
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