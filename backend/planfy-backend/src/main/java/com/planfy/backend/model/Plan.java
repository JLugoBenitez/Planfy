package com.planfy.backend.model;

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
@Table(name = "planes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Plan {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String nombre;
	private String descripcion;
	private Double duracion;
	private Boolean gratuito;
	private Double precio;
	private Double latitud;
	private Double longitud;
	
	@ManyToOne
	@JoinColumn(name="ciudad_id")
	private Ciudad ciudad;
	
	@ManyToOne
	@JoinColumn(name="categoria_id")
	private Categoria categoria;
}
