package com.planfy.backend.service;

import java.util.Collections;
import java.util.List;
import java.util.Random;

import org.springframework.stereotype.Service;

import com.planfy.backend.model.*;
import com.planfy.backend.repository.*;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlanService {

    private final PlanRepository planRepository;
    private final CiudadRepository ciudadRepository;
    private final CategoriaRepository categoriaRepository;

        public Plan crearPlan(Plan plan, Long ciudadId, Long categoriaId) {
        Ciudad ciudad = ciudadRepository.findById(ciudadId)
                .orElseThrow(() -> new RuntimeException("Ciudad no encontrada"));
        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        plan.setCiudad(ciudad);
        plan.setCategoria(categoria);

        return planRepository.save(plan);
    }

    public List<Plan> obtenerTodos() {
        return planRepository.findAll();
    }

    public Plan obtenerPorId(Long id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado"));
    }

    public Plan actualizarPlan(Long id, Plan planActualizado, Long ciudadId, Long categoriaId) {
        Plan plan = obtenerPorId(id);

        Ciudad ciudad = ciudadRepository.findById(ciudadId)
                .orElseThrow(() -> new RuntimeException("Ciudad no encontrada"));
        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        plan.setNombre(planActualizado.getNombre());
        plan.setDescripcion(planActualizado.getDescripcion());
        plan.setDuracion(planActualizado.getDuracion());
        plan.setGratuito(planActualizado.getGratuito());
        plan.setPrecio(planActualizado.getPrecio());
        plan.setLatitud(planActualizado.getLatitud());
        plan.setLongitud(planActualizado.getLongitud());
        plan.setCiudad(ciudad);
        plan.setCategoria(categoria);

        return planRepository.save(plan);
    }

    public void eliminarPlan(Long id) {
        planRepository.deleteById(id);
    }

    public Plan obtenerPlanAleatorio() {
        List<Plan> planes = planRepository.findAll();

        if (planes.isEmpty()) {
            throw new RuntimeException("No hay planes disponibles");
        }

        Random random = new Random();
        return planes.get(random.nextInt(planes.size()));
    }

    public Plan obtenerPlanAleatorioConFiltros(Long ciudadId, Long categoriaId, Double precioMax) {
        List<Plan> planes = planRepository.findByFiltros(ciudadId, categoriaId, precioMax);

        if (planes.isEmpty()) {
            throw new RuntimeException("No se encontraron planes con esos filtros");
        }

        Collections.shuffle(planes, new Random());
        return planes.get(0);
    }
}
