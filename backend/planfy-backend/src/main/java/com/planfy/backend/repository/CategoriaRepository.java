package com.planfy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.planfy.backend.model.Categoria;
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {}
