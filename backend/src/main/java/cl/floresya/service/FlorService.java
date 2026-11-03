package cl.floresya.service;

import cl.floresya.model.Flor;
import cl.floresya.repository.FlorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FlorService {

    private final FlorRepository repo;

    public FlorService(FlorRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    public List<Flor> listar() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public Flor obtener(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
    }

    @Transactional(readOnly = true)
    public List<Flor> stockCritico() {
        return repo.findStockCritico();
    }

    @Transactional
    public Flor crear(Flor flor) {
        String codigo = flor.getCodigo().trim();
        if (repo.existsByCodigoIgnoreCase(codigo)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un producto con el código " + codigo);
        }
        flor.setId(null);
        flor.setCodigo(codigo);
        return repo.save(flor);
    }

    @Transactional
    public Flor actualizar(Long id, Flor datos) {
        Flor existente = obtener(id);
        String codigo = datos.getCodigo().trim();
        repo.findByCodigoIgnoreCase(codigo).ifPresent(otro -> {
            if (!otro.getId().equals(id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un producto con el código " + codigo);
            }
        });
        existente.setCodigo(codigo);
        existente.setNombre(datos.getNombre());
        existente.setCategoria(datos.getCategoria());
        existente.setPrecio(datos.getPrecio());
        existente.setStock(datos.getStock());
        existente.setStockCritico(datos.getStockCritico());
        existente.setOcasion(datos.getOcasion());
        existente.setImagen(datos.getImagen());
        existente.setDescripcion(datos.getDescripcion());
        existente.setCuidados(datos.getCuidados());
        return repo.save(existente);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado");
        }
        repo.deleteById(id);
    }
}
