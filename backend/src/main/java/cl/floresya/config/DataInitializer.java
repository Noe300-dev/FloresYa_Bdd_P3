package cl.floresya.config;

import cl.floresya.model.Flor;
import cl.floresya.model.Usuario;
import cl.floresya.repository.FlorRepository;
import cl.floresya.repository.UsuarioRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.InputStream;
import java.util.List;

/**
 * Al arrancar, si la base está vacía carga el catálogo inicial (flores-seed.json, copiado de
 * floresData.js) y crea el administrador y un cliente de prueba. No pisa datos existentes.
 */
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner cargarDatosIniciales(UsuarioRepository usuarios,
                                           FlorRepository flores,
                                           PasswordEncoder encoder,
                                           ObjectMapper mapper,
                                           @Value("${floresya.admin.nombre:Administrador}") String adminNombre,
                                           @Value("${floresya.admin.correo:admin@floresya.cl}") String adminCorreo,
                                           @Value("${floresya.admin.telefono:+56912345678}") String adminTelefono,
                                           @Value("${floresya.admin.password:admin123}") String adminPassword) {
        return args -> {
            crearUsuarioSiNoExiste(usuarios, encoder, adminNombre, adminCorreo, adminTelefono,
                    adminPassword, Usuario.ROL_ADMIN);
            crearUsuarioSiNoExiste(usuarios, encoder, "Estudiante Duoc", "estudiante@duocuc.cl",
                    "+56999887766", "password123", Usuario.ROL_CLIENTE);

            if (flores.count() == 0) {
                try (InputStream in = new ClassPathResource("flores-seed.json").getInputStream()) {
                    List<Flor> iniciales = mapper.readValue(in, new TypeReference<List<Flor>>() {});
                    flores.saveAll(iniciales);
                }
            }
        };
    }

    private void crearUsuarioSiNoExiste(UsuarioRepository repo, PasswordEncoder encoder, String nombre,
                                        String correo, String telefono, String password, String rol) {
        if (repo.existsByCorreoIgnoreCase(correo)) {
            return;
        }
        Usuario u = new Usuario();
        u.setNombre(nombre);
        u.setCorreo(correo.toLowerCase());
        u.setTelefono(telefono);
        u.setPassword(encoder.encode(password));
        u.setRol(rol);
        repo.save(u);
    }
    
}
