package com.planfy.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.planfy.backend.model.Plan;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {

    @Query("SELECT p FROM Plan p WHERE " +
           "(:ciudadId IS NULL OR p.ciudad.id = :ciudadId) AND " +
           "(:categoriaId IS NULL OR p.categoria.id = :categoriaId) AND " +
           "(:precioMax IS NULL OR p.precio <= :precioMax)")
    List<Plan> findByFiltros(Long ciudadId, Long categoriaId, Double precioMax);
}
