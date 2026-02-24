package com.internmatch.user.dto;

import com.internmatch.shared.enums.Role;
import lombok.Data;

@Data
public class UserResponseDto {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private boolean isActive;
    private boolean isVerified;
}