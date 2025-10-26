package com.planfy.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "shuffle_sesion")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ShuffleSession {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	private LocalDateTime fecha = LocalDateTime.now();
	
	private Double duracionMax;
	private Boolean gratis;
	
	@ManyToOne
	@JoinColumn(name="usuario_id")
	private User usuario;
	
	@ManyToOne
	@JoinColumn(name="ciudad_id")
	private Ciudad ciudad;
	
	@ManyToOne
	@JoinColumn(name="categoria_id")
	private Categoria categoria;
}
