package com.planfy.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.planfy.backend.model.Categoria;
import com.planfy.backend.model.Ciudad;
import com.planfy.backend.repository.CategoriaRepository;
import com.planfy.backend.repository.CiudadRepository;

import lombok.RequiredArgsConstructor;

/**
 * Endpoints meta para que el frontend pueda construir filtros con dropdowns
 * dinámicos (ciudades / categorías existentes en la BD).
 */
@RestController
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MetaController {

    private final CiudadRepository ciudadRepository;
    private final CategoriaRepository categoriaRepository;

    @GetMapping("/ciudades")
    public List<Ciudad> getCiudades() {
        return ciudadRepository.findAll();
    }

    @GetMapping("/categorias")
    public List<Categoria> getCategorias() {
        return categoriaRepository.findAll();
    }
}
