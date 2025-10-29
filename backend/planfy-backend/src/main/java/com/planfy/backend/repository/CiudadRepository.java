package com.planfy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.planfy.backend.model.Ciudad;

public interface CiudadRepository extends JpaRepository<Ciudad, Long> {}
