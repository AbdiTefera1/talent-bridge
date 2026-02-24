package com.internmatch.user.entity;

import com.internmatch.shared.entity.BaseEntity;
import com.internmatch.shared.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity implements UserDetails {

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(unique = true, nullable = false, length = 150)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Role role;

    @Column(name = "is_verified")
    private boolean isVerified = true;

    @Column(name = "is_active")
    private boolean isActive = true;

    // Relations (optional)
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private TalentProfile talentProfile;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private CompanyProfile companyProfile;

    // ────────────────────────────────────────────────
    // Implement UserDetails methods
    // ────────────────────────────────────────────────

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return email;           // using email as username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return isActive;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive && isVerified;   // or just isActive — your choice
    }
}