package com.planfy.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.planfy.backend.model.*;
import com.planfy.backend.repository.*;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final UserLikePlanRepository likeRepo;
    private final UserRepository userRepo;
    private final PlanRepository planRepo;

    public void vote(Long userId, Long planId, boolean liked) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Plan plan = planRepo.findById(planId).orElseThrow(() -> new RuntimeException("Plan not found"));

        UserLikePlan vote = likeRepo.findByUserIdAndPlanId(userId, planId)
                .orElse(UserLikePlan.builder().user(user).plan(plan).build());

        vote.setLiked(liked);
        likeRepo.save(vote);
    }

    public void unvote(Long userId, Long planId) {
        likeRepo.findByUserIdAndPlanId(userId, planId)
                .ifPresent(likeRepo::delete);
    }

    public Boolean getVoteStatus(Long userId, Long planId) {
        return likeRepo.findByUserIdAndPlanId(userId, planId)
                .map(UserLikePlan::getLiked)
                .orElse(null); // null = no voto
    }

    public List<UserLikePlan> getUserLikes(Long userId) {
        return likeRepo.findByUserIdAndLikedTrue(userId);
    }

    public Long countLikes(Long planId) {
        return likeRepo.countByPlanIdAndLikedTrue(planId);
    }

    public Long countDislikes(Long planId) {
        return likeRepo.countByPlanIdAndLikedFalse(planId);
    }
}
