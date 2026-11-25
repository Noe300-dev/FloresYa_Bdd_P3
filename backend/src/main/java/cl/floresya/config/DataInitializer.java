package cl.floresya.config;

import cl.floresya.model.Flor;
import cl.floresya.model.Usuario;
import cl.floresya.repository.FlorRepository;
import cl.floresya.repository.UsuarioRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Al arrancar, si la base está vacía carga el catálogo inicial (flores-seed.json)
 * y crea el administrador y un cliente de prueba. No pisa datos existentes.
 */
@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner cargarDatosIniciales(
            UsuarioRepository usuarios,
            FlorRepository flores,
            PasswordEncoder encoder,
            ObjectMapper mapper,
            @Value("${floresya.admin.nombre:Administrador}") String adminNombre,
            @Value("${floresya.admin.correo:admin@floresya.cl}") String adminCorreo,
            @Value("${floresya.admin.telefono:+56912345678}") String adminTelefono,
            @Value("${floresya.admin.password:admin123}") String adminPassword) {
        return args -> {
            crearUsuarioSiNoExiste(
                    usuarios,
                    encoder,
                    adminNombre,
                    adminCorreo,
                    adminTelefono,
                    adminPassword,
                    Usuario.ROL_ADMIN);

            crearUsuarioSiNoExiste(
                    usuarios,
                    encoder,
                    "Estudiante Duoc",
                    "estudiante@duocuc.cl",
                    "+56999887766",
                    "password123",
                    Usuario.ROL_CLIENTE);

            cargarCatalogoSiEstaVacio(flores, mapper);
        };
    }

    private void crearUsuarioSiNoExiste(
            UsuarioRepository repo,
            PasswordEncoder encoder,
            String nombre,
            String correo,
            String telefono,
            String password,
            String rol) {
        if (correo == null || correo.isBlank() || repo.existsByCorreoIgnoreCase(correo)) {
            return;
        }

        Usuario u = new Usuario();
        u.setNombre(nombre);
        u.setCorreo(correo.trim().toLowerCase());
        u.setTelefono(telefono);
        u.setPassword(encoder.encode(password));
        u.setRol(rol);
        repo.save(u);

        log.info("Usuario inicial creado ({}): {}", rol, u.getCorreo());
    }

    private void cargarCatalogoSiEstaVacio(FlorRepository flores, ObjectMapper mapper) throws IOException {
        if (flores.count() > 0) {
            return;
        }

        ClassPathResource resource = new ClassPathResource("flores-seed.json");
        try (InputStream in = resource.getInputStream()) {
            List<Flor> iniciales = mapper.readValue(in, new TypeReference<List<Flor>>() {});
            flores.saveAll(iniciales);
            log.info("Catálogo inicial cargado desde flores-seed.json ({} flores)", iniciales.size());
        }
    }
}