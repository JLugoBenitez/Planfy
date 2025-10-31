package com.planfy.backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.planfy.backend.service.LikeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/plans")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    private Long getUserId(Authentication auth) {
        return Long.parseLong(auth.getPrincipal().toString());
    }

    @PostMapping("/{planId}/like")
    public String like(@PathVariable Long planId, Authentication auth) {
        likeService.vote(getUserId(auth), planId, true);
        return "👍 Liked";
    }

    @PostMapping("/{planId}/dislike")
    public String dislike(@PathVariable Long planId, Authentication auth) {
        likeService.vote(getUserId(auth), planId, false);
        return "👎 Disliked";
    }

    @DeleteMapping("/{planId}/vote")
    public String unvote(@PathVariable Long planId, Authentication auth) {
        likeService.unvote(getUserId(auth), planId);
        return "✅ Vote removed";
    }

    @GetMapping("/{planId}/vote-status")
    public Boolean voteStatus(@PathVariable Long planId, Authentication auth) {
        return likeService.getVoteStatus(getUserId(auth), planId);
    }

    @GetMapping("/{planId}/votes-summary")
    public Object votesSummary(@PathVariable Long planId) {
        return new Object() {
            public final Long likes = likeService.countLikes(planId);
            public final Long dislikes = likeService.countDislikes(planId);
        };
    }

    @GetMapping("/me/liked")
    public Object myLikes(Authentication auth) {
        return likeService.getUserLikes(getUserId(auth));
    }
}
