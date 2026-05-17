package com.planfy.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "user_like_plan",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "plan_id"})
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserLikePlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    private Plan plan;

    private Boolean liked;

    private LocalDateTime fecha;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        fecha = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
