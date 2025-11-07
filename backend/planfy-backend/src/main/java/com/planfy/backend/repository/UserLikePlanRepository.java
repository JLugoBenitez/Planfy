package com.planfy.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planfy.backend.model.Plan;
import com.planfy.backend.model.User;
import com.planfy.backend.model.UserLikePlan;

public interface UserLikePlanRepository extends JpaRepository<UserLikePlan, Long> {
    Optional<UserLikePlan> findByUserAndPlan(User user, Plan plan);
    Optional<UserLikePlan> findByUserIdAndPlanId(Long userId, Long planId);

    List<UserLikePlan> findByUserIdAndLikedTrue(Long userId);

    Long countByPlanIdAndLikedTrue(Long planId);

    Long countByPlanIdAndLikedFalse(Long planId);
	List<UserLikePlan> findByUserId(Long userId);

}
