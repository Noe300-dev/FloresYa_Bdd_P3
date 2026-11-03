package cl.floresya.repository;

import cl.floresya.model.Flor;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FlorRepository extends JpaRepository<Flor, Long> {

    boolean existsByCodigoIgnoreCase(String codigo);

    Optional<Flor> findByCodigoIgnoreCase(String codigo);

    /** Productos cuyo stock llegó al nivel crítico (alerta del panel admin). */
    @Query("select f from Flor f where f.stock <= f.stockCritico order by f.stock asc")
    List<Flor> findStockCritico();

    /** Bloquea la fila mientras se descuenta stock, para no vender de más si compran dos a la vez. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select f from Flor f where f.id = :id")
    Optional<Flor> findByIdForUpdate(@Param("id") Long id);
}
