package com.internmatch.auth.service;

import com.internmatch.auth.dto.AuthResponse;
import com.internmatch.auth.dto.LoginRequest;
import com.internmatch.auth.dto.RegisterRequest;
import com.internmatch.shared.enums.Role;
import com.internmatch.user.entity.CompanyProfile;
import com.internmatch.user.entity.TalentProfile;
import com.internmatch.user.entity.User;
import com.internmatch.user.repository.CompanyProfileRepository;
import com.internmatch.user.repository.TalentProfileRepository;
import com.internmatch.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CompanyProfileRepository companyProfileRepository;
    private final TalentProfileRepository talentProfileRepository;

//    public AuthResponse register(RegisterRequest request) {
//        var user = new User();
//        user.setFullName(request.getFullName());
//        user.setEmail(request.getEmail());
//        user.setPassword(passwordEncoder.encode(request.getPassword()));
//        user.setRole(Role.valueOf(request.getRole().toUpperCase()));
//
//        userRepository.save(user);
//
//        var jwtToken = jwtService.generateToken(user);
//        return new AuthResponse(jwtToken, user.getRole().name());
//    }
public AuthResponse register(RegisterRequest request) {
    // ... existing validation and user creation ...

    User user = new User();
    user.setFullName(request.getFullName());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(Role.valueOf(request.getRole().toUpperCase()));

    User savedUser = userRepository.save(user);

    // Auto-create profile based on role
    if (savedUser.getRole() == Role.COMPANY) {
        CompanyProfile profile = new CompanyProfile();
        profile.setUser(savedUser);
        profile.setCompanyName(request.getFullName() + " Company"); // or add field in RegisterRequest
        // set other defaults if needed
        companyProfileRepository.save(profile);
    } else if (savedUser.getRole() == Role.TALENT) {
        TalentProfile profile = new TalentProfile();
        profile.setUser(savedUser);
        talentProfileRepository.save(profile);
    }

    String jwtToken = jwtService.generateToken(savedUser);
    return new AuthResponse(jwtToken, savedUser.getRole().name());
}

    public AuthResponse login(LoginRequest request) {

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            System.out.println("Authentication SUCCESS - Principal: " + authentication.getPrincipal());
        } catch (BadCredentialsException e) {
            System.out.println("AUTH FAILED: BadCredentialsException - Wrong password");
            throw e;
        } catch (DisabledException e) {
            System.out.println("AUTH FAILED: DisabledException - Account is disabled (check isEnabled())");
            throw e;
        } catch (LockedException e) {
            System.out.println("AUTH FAILED: LockedException - Account is locked (check isAccountNonLocked())");
            throw e;
        } catch (Exception e) {
            System.out.println("AUTH FAILED: Unexpected error - " + e.getClass().getSimpleName());
            e.printStackTrace();
            throw new RuntimeException("Authentication failed", e);
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken, user.getRole().name());
    }
}