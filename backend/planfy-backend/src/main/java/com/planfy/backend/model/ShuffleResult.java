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
@Table(name = "shuffle_resultado")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ShuffleResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Boolean favorito;
    private Boolean likePlan;
    
    @ManyToOne
    @JoinColumn(name="shuffle_id")
    private ShuffleSession shuffleSession;
    
    @ManyToOne
    @JoinColumn(name="plan_id")
    private Plan plan;
}
