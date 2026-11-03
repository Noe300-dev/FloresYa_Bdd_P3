package cl.floresya.service;

import cl.floresya.dto.LoginRequest;
import cl.floresya.dto.RegistroRequest;
import cl.floresya.dto.UsuarioResponse;
import cl.floresya.model.Usuario;
import cl.floresya.repository.PedidoRepository;
import cl.floresya.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UsuarioService {

    /** Mismos dominios que valida el frontend en validarCorreo(). */
    private static final List<String> DOMINIOS_PERMITIDOS = List.of("@gmail.com", "@duocuc.cl", "@profesor.cl");

    private final UsuarioRepository usuarios;
    private final PedidoRepository pedidos;
    private final PasswordEncoder encoder;

    public UsuarioService(UsuarioRepository usuarios, PedidoRepository pedidos, PasswordEncoder encoder) {
        this.usuarios = usuarios;
        this.pedidos = pedidos;
        this.encoder = encoder;
    }

    /** Registro público: siempre crea cuentas de tipo Cliente (un admin solo lo crea otro admin). */
    @Transactional
    public UsuarioResponse registrar(RegistroRequest req) {
        String correo = req.correo().trim().toLowerCase();
        if (DOMINIOS_PERMITIDOS.stream().noneMatch(correo::endsWith)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Correo no permitido. Debe pertenecer a @duocuc.cl, @profesor.cl o @gmail.com");
        }
        if (usuarios.existsByCorreoIgnoreCase(correo)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este correo electrónico ya está registrado.");
        }
        Usuario u = new Usuario();
        u.setNombre(req.nombre().trim());
        u.setCorreo(correo);
        u.setTelefono(req.telefono() == null ? null : req.telefono().trim());
        u.setPassword(encoder.encode(req.password()));
        u.setRol(Usuario.ROL_CLIENTE);
        return UsuarioResponse.de(usuarios.save(u));
    }

    @Transactional(readOnly = true)
    public UsuarioResponse login(LoginRequest req) {
        Usuario u = usuarios.findByCorreoIgnoreCase(req.correo().trim())
                .filter(x -> encoder.matches(req.password(), x.getPassword()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "Credenciales incorrectas. Verifica tu correo y contraseña."));
        return UsuarioResponse.de(u);
    }

    @Transactional(readOnly = true)
    public UsuarioResponse perfil(String correo) {
        return usuarios.findByCorreoIgnoreCase(correo)
                .map(UsuarioResponse::de)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sesión inválida"));
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listar() {
        return usuarios.findAll().stream().map(UsuarioResponse::de).toList();
    }

    @Transactional
    public UsuarioResponse cambiarRol(Long id, String nuevoRol) {
        if (!Usuario.ROL_ADMIN.equals(nuevoRol) && !Usuario.ROL_CLIENTE.equals(nuevoRol)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rol inválido (Administrador o Cliente)");
        }
        Usuario u = buscar(id);
        boolean eraAdmin = Usuario.ROL_ADMIN.equals(u.getRol());
        if (eraAdmin && Usuario.ROL_CLIENTE.equals(nuevoRol) && usuarios.countByRol(Usuario.ROL_ADMIN) <= 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Debe existir al menos un administrador.");
        }
        u.setRol(nuevoRol);
        return UsuarioResponse.de(usuarios.save(u));
    }

    @Transactional
    public void eliminar(Long id, String correoSolicitante) {
        Usuario u = buscar(id);
        if (u.getCorreo().equalsIgnoreCase(correoSolicitante)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No puedes eliminar tu propia cuenta.");
        }
        if (Usuario.ROL_ADMIN.equals(u.getRol()) && usuarios.countByRol(Usuario.ROL_ADMIN) <= 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Debe existir al menos un administrador.");
        }
        pedidos.desvincularUsuario(id);
        usuarios.delete(u);
    }

    private Usuario buscar(Long id) {
        return usuarios.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }
}
