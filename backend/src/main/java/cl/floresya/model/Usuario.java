package cl.floresya.model;

import jakarta.persistence.*;

/** Cuenta de usuario. El rol es "Administrador" o "Cliente" (mismos textos que usa el frontend). */
@Entity
@Table(name = "usuarios")
public class Usuario {

    public static final String ROL_ADMIN = "Administrador";
    public static final String ROL_CLIENTE = "Cliente";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(nullable = false, unique = true, length = 120)
    private String correo;

    @Column(length = 30)
    private String telefono;

    /** Hash BCrypt, nunca la clave en texto plano. */
    @Column(nullable = false, length = 100)
    private String password;

    @Column(nullable = false, length = 20)
    private String rol = ROL_CLIENTE;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}
