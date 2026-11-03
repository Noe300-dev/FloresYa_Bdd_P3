package cl.floresya.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Value("${floresya.cors.origins}")
    private String[] corsOrigins;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // 401 / 403 en JSON y sin el popup nativo de login del navegador
        AuthenticationEntryPoint noAutenticado = (req, res, ex) -> {
            res.setStatus(401);
            res.setContentType("application/json;charset=UTF-8");
            res.getWriter().write("{\"error\":\"No autenticado o credenciales inválidas\"}");
        };
        AccessDeniedHandler sinPermiso = (req, res, ex) -> {
            res.setStatus(403);
            res.setContentType("application/json;charset=UTF-8");
            res.getWriter().write("{\"error\":\"No tienes permisos de administrador para esta acción\"}");
        };

        http
    .csrf(AbstractHttpConfigurer::disable)
    .cors(Customizer.withDefaults())
    .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    .authorizeHttpRequests(auth -> auth
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .requestMatchers("/error").permitAll()

        // Documentation Swagger / OpenAPI
        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()

        // Público
        .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/register").permitAll()
        .requestMatchers(HttpMethod.GET, "/api/flores/stock-critico").hasRole("ADMIN")
        .requestMatchers(HttpMethod.GET, "/api/flores", "/api/flores/**").permitAll()

        // Solo administrador
        .requestMatchers("/api/flores", "/api/flores/**").hasRole("ADMIN")
        .requestMatchers("/api/usuarios", "/api/usuarios/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.GET, "/api/pedidos").hasRole("ADMIN")
        .requestMatchers(HttpMethod.PUT, "/api/pedidos/*/estado").hasRole("ADMIN")

        // Cualquier usuario con sesión
        .requestMatchers("/api/auth/me", "/api/pedidos", "/api/pedidos/**").authenticated()

        .anyRequest().denyAll())
    .httpBasic(basic -> basic.authenticationEntryPoint(noAutenticado))
    .exceptionHandling(e -> e
        .authenticationEntryPoint(noAutenticado)
        .accessDeniedHandler(sinPermiso));

return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(List.of(corsOrigins));
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }

}
