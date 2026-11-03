package cl.floresya.security;

import cl.floresya.model.Usuario;
import cl.floresya.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/** Spring Security autentica contra la tabla usuarios (el "username" es el correo). */
@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository repo;

    public UsuarioDetailsService(UsuarioRepository repo) {
        this.repo = repo;
    }

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario u = repo.findByCorreoIgnoreCase(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        String rol = Usuario.ROL_ADMIN.equals(u.getRol()) ? "ADMIN" : "CLIENTE";
        return User.withUsername(u.getCorreo())
                .password(u.getPassword())
                .roles(rol)
                .build();
    }
}
