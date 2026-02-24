package com.internmatch.admin.controller;

import com.internmatch.admin.service.AdminService;
import com.internmatch.user.dto.UserResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDto>> listUsers() {
        return ResponseEntity.ok(adminService.listAllUsers());
    }

    @PatchMapping("/users/{id}/active")
    public ResponseEntity<Void> toggleActive(@PathVariable Long id, @RequestParam boolean active) {
        adminService.toggleUserActive(id, active);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/users/{id}/verify")
    public ResponseEntity<Void> verifyUser(@PathVariable Long id, @RequestParam boolean verified) {
        adminService.verifyUser(id, verified);
        return ResponseEntity.ok().build();
    }
}