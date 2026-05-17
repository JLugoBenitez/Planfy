package com.planfy.backend.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.planfy.backend.model.User;
import com.planfy.backend.model.Plan;
import com.planfy.backend.model.UserLikePlan;
import com.planfy.backend.repository.UserLikePlanRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserLikePlanService {

    private final UserLikePlanRepository userLikePlanRepository;

    public void likePlan(User user, Plan plan, boolean liked) {

        UserLikePlan entry = userLikePlanRepository.findByUserAndPlan(user, plan)
            .orElse(UserLikePlan.builder()
                    .user(user)
                    .plan(plan)
                    .fecha(LocalDateTime.now())
                    .build()
            );

        entry.setLiked(liked);
        entry.setFecha(LocalDateTime.now());

        userLikePlanRepository.save(entry);
    }
}
