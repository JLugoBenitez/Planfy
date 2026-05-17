package com.planfy.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.planfy.backend.model.Ciudad;

public interface CiudadRepository extends JpaRepository<Ciudad, Long> {

    @Query("select distinct c from Plan p join p.ciudad c order by c.nombre")
    List<Ciudad> findWithPlans();
}
