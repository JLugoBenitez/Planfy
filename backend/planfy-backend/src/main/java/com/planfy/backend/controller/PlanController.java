package com.planfy.backend.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.planfy.backend.model.Plan;
import com.planfy.backend.repository.UserRepository;
import com.planfy.backend.service.PlanService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/plans")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PlanController {

    private final PlanService planService;
    private final UserRepository userRepository;


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
    @GetMapping("/swipe")
    public ResponseEntity<?> obtenerPlanParaSwipe(
            Authentication auth,
            @RequestParam(required = false) Long ciudadId,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Boolean gratuito,
            @RequestParam(required = false) Double precioMax
    ) {
        String email = auth.getName();
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"))
                .getId();

        Plan plan = planService.obtenerPlanParaSwipe(userId, ciudadId, categoriaId, gratuito, precioMax);

        if (plan == null) {
            return ResponseEntity.ok(Collections.singletonMap("message", "No hay más planes disponibles"));
        }

        return ResponseEntity.ok(plan);
    }
}

