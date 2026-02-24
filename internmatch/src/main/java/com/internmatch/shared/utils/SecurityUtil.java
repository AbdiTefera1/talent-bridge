// src/main/java/com/internmatch/shared/util/SecurityUtil.java
package com.internmatch.shared.utils;

import com.internmatch.user.entity.User;
import com.internmatch.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.server.ResponseStatusException;

public final class SecurityUtil {


    private SecurityUtil() {} // prevent instantiation

    public static Long getCurrentUserId(Authentication authentication, UserRepository userRepository) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        Object principal = authentication.getPrincipal();

        // Preferred: JWT claim (fast, no DB hit)
        if (principal instanceof Jwt jwt) {
            String userIdStr = jwt.getClaimAsString("userId");
            if (userIdStr != null) {
                try {
                    return Long.parseLong(userIdStr);
                } catch (NumberFormatException ignored) {}
            }
        }

        // Fallback 1: If principal is User entity
        if (principal instanceof User user) {
            if (user.getId() != null) {
                return user.getId();
            }
        }

        // Fallback 2: Lookup by email/username
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}