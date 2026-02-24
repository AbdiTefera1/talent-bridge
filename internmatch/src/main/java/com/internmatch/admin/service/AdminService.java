package com.internmatch.admin.service;

import com.internmatch.user.dto.UserResponseDto;
import com.internmatch.user.entity.User;
import com.internmatch.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    public List<UserResponseDto> listAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> {
                    UserResponseDto dto = new UserResponseDto();
                    dto.setId(user.getId());
                    dto.setFullName(user.getFullName());
                    dto.setEmail(user.getEmail());
                    dto.setRole(user.getRole());
                    dto.setActive(user.isActive());
                    dto.setVerified(user.isVerified());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public void toggleUserActive(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(active);
        userRepository.save(user);
    }

    public void verifyUser(Long userId, boolean verified) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setVerified(verified);
        userRepository.save(user);
    }
}