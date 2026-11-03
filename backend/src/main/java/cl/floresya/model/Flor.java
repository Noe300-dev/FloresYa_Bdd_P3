package cl.floresya.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

/** Producto del catálogo. Los nombres de campo coinciden con los que usa el frontend React. */
@Entity
@Table(name = "flores")
public class Flor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El código es obligatorio")
    @Size(max = 30, message = "El código admite hasta 30 caracteres")
    @Column(nullable = false, unique = true, length = 30)
    private String codigo;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 150, message = "El nombre admite hasta 150 caracteres")
    @Column(nullable = false, length = 150)
    private String nombre;

    @Size(max = 60)
    @Column(length = 60)
    private String categoria;

    @NotNull(message = "El precio es obligatorio")
    @Min(value = 1, message = "El precio debe ser mayor a 0")
    @Column(nullable = false)
    private Integer precio;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    @Column(nullable = false)
    private Integer stock = 0;

    @NotNull(message = "El stock crítico es obligatorio")
    @Min(value = 0, message = "El stock crítico no puede ser negativo")
    @Column(name = "stock_critico", nullable = false)
    private Integer stockCritico = 0;

    @Size(max = 60)
    @Column(length = 60)
    private String ocasion;

    @Size(max = 1000, message = "La URL de imagen admite hasta 1000 caracteres")
    @Column(length = 1000)
    private String imagen;

    @Size(max = 1000, message = "La descripción admite hasta 1000 caracteres")
    @Column(length = 1000)
    private String descripcion;

    @Size(max = 500)
    @Column(length = 500)
    private String cuidados;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public Integer getPrecio() { return precio; }
    public void setPrecio(Integer precio) { this.precio = precio; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public Integer getStockCritico() { return stockCritico; }
    public void setStockCritico(Integer stockCritico) { this.stockCritico = stockCritico; }
    public String getOcasion() { return ocasion; }
    public void setOcasion(String ocasion) { this.ocasion = ocasion; }
    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getCuidados() { return cuidados; }
    public void setCuidados(String cuidados) { this.cuidados = cuidados; }
}
