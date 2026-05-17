package com.planfy.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.planfy.backend.model.Categoria;
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    @Query("select distinct c from Plan p join p.categoria c order by c.nombre")
    List<Categoria> findWithPlans();
}
