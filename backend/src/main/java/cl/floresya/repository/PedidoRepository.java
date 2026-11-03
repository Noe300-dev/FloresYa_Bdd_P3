package cl.floresya.repository;

import cl.floresya.model.Pedido;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    boolean existsByCodigo(String codigo);

    @EntityGraph(attributePaths = {"items", "usuario"})
    Optional<Pedido> findByCodigo(String codigo);

    @EntityGraph(attributePaths = {"items", "usuario"})
    List<Pedido> findAllByOrderByIdDesc();

    @EntityGraph(attributePaths = {"items", "usuario"})
    List<Pedido> findByUsuarioCorreoIgnoreCaseOrderByIdDesc(String correo);

    /** Al borrar un usuario se conservan sus pedidos, pero sin vínculo a la cuenta. */
    @Modifying(clearAutomatically = true)
    @Query("update Pedido p set p.usuario = null where p.usuario.id = :usuarioId")
    int desvincularUsuario(@Param("usuarioId") Long usuarioId);
}
