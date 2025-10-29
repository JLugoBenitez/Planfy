package com.planfy.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.planfy.backend.model.Plan;
import com.planfy.backend.service.PlanService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/plans")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PlanController {

    private final PlanService planService;

    @GetMapping
    public List<Plan> obtenerTodos() {
        return planService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Plan obtenerPorId(@PathVariable Long id) {
        return planService.obtenerPorId(id);
    }

    @PostMapping
    public Plan crearPlan(@RequestBody Plan plan,
                          @RequestParam Long ciudadId,
                          @RequestParam Long categoriaId) {
        return planService.crearPlan(plan, ciudadId, categoriaId);
    }

    @PutMapping("/{id}")
    public Plan actualizarPlan(@PathVariable Long id,
                               @RequestBody Plan plan,
                               @RequestParam Long ciudadId,
                               @RequestParam Long categoriaId) {
        return planService.actualizarPlan(id, plan, ciudadId, categoriaId);
    }

    @DeleteMapping("/{id}")
    public void eliminarPlan(@PathVariable Long id) {
        planService.eliminarPlan(id);
    }

    @GetMapping("/random")
    public Plan obtenerPlanAleatorio() {
        return planService.obtenerPlanAleatorio();
    }

    @GetMapping("/shuffle")
    public Plan obtenerPlanAleatorioConFiltros(
            @RequestParam(required = false) Long ciudadId,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Double precioMax
    ) {
        return planService.obtenerPlanAleatorioConFiltros(ciudadId, categoriaId, precioMax);
    }
}
