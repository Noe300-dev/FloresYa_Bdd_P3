package cl.floresya.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Código visible para el cliente, ej: PED-483920 */
    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @Column(nullable = false)
    private LocalDateTime fecha = LocalDateTime.now();

    /** Puede quedar en null si el usuario es eliminado (el pedido se conserva). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(nullable = false, length = 120)
    private String destinatario;

    @Column(nullable = false, length = 200)
    private String direccion;

    @Column(nullable = false, length = 60)
    private String comuna;

    @Column(length = 30)
    private String telefono;

    @Column(length = 500)
    private String dedicatoria;

    @Column(length = 20)
    private String cupon;

    @Column(nullable = false)
    private Integer subtotal;

    @Column(name = "porcentaje_descuento", nullable = false)
    private Integer porcentajeDescuento = 0;

    @Column(name = "monto_descuento", nullable = false)
    private Integer montoDescuento = 0;

    @Column(nullable = false)
    private Integer envio = 0;

    @Column(nullable = false)
    private Integer total;

    @Column(nullable = false, length = 30)
    private String estado = "En preparación";

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> items = new ArrayList<>();

    public void agregarItem(ItemPedido item) {
        item.setPedido(this);
        items.add(item);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public String getDestinatario() { return destinatario; }
    public void setDestinatario(String destinatario) { this.destinatario = destinatario; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getComuna() { return comuna; }
    public void setComuna(String comuna) { this.comuna = comuna; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getDedicatoria() { return dedicatoria; }
    public void setDedicatoria(String dedicatoria) { this.dedicatoria = dedicatoria; }
    public String getCupon() { return cupon; }
    public void setCupon(String cupon) { this.cupon = cupon; }
    public Integer getSubtotal() { return subtotal; }
    public void setSubtotal(Integer subtotal) { this.subtotal = subtotal; }
    public Integer getPorcentajeDescuento() { return porcentajeDescuento; }
    public void setPorcentajeDescuento(Integer porcentajeDescuento) { this.porcentajeDescuento = porcentajeDescuento; }
    public Integer getMontoDescuento() { return montoDescuento; }
    public void setMontoDescuento(Integer montoDescuento) { this.montoDescuento = montoDescuento; }
    public Integer getEnvio() { return envio; }
    public void setEnvio(Integer envio) { this.envio = envio; }
    public Integer getTotal() { return total; }
    public void setTotal(Integer total) { this.total = total; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public List<ItemPedido> getItems() { return items; }
    public void setItems(List<ItemPedido> items) { this.items = items; }
}
