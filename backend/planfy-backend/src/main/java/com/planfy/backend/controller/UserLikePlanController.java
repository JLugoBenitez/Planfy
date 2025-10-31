package com.planfy.backend.controller;

import com.planfy.backend.model.Plan;
import com.planfy.backend.model.User;
import com.planfy.backend.service.PlanService;
import com.planfy.backend.service.UserLikePlanService;
import com.planfy.backend.service.AuthUserService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/plans")
@RequiredArgsConstructor
public class UserLikePlanController {

    private final UserLikePlanService likeService;
    private final PlanService planService;
    private final AuthUserService authUserService; // para obtener usuario logueado

    @PostMapping("/{id}/like")
    public void likePlan(@PathVariable Long id) {
        User user = authUserService.getAuthenticatedUser();
        Plan plan = planService.obtenerPorId(id);
        likeService.likePlan(user, plan, true);
    }

    @PostMapping("/{id}/dislike")
    public void dislikePlan(@PathVariable Long id) {
        User user = authUserService.getAuthenticatedUser();
        Plan plan = planService.obtenerPorId(id);
        likeService.likePlan(user, plan, false);
    }
}
