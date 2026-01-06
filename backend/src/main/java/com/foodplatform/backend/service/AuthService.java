package com.foodplatform.backend.service;


import com.foodplatform.backend.dto.AuthResponse;
import com.foodplatform.backend.dto.LoginRequest;
import com.foodplatform.backend.dto.RegisterRequest;
import com.foodplatform.backend.model_temp.Role;
import com.foodplatform.backend.model_temp.User;
import com.foodplatform.backend.repository.UserRepository;
import com.foodplatform.backend.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        // 1. Validation: Check if user exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // 2. Map Roles (String -> Enum)
        Set<Role> roles = new HashSet<>();
        if (request.getRoles() != null) {
            for (String role : request.getRoles()) {
                try {
                    roles.add(Role.valueOf(role.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    // Ignore invalid roles or set default
                    roles.add(Role.USER);
                }
            }
        } else {
            roles.add(Role.USER); // Default role
        }

        // 3. Create User Object
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // HASH IT!
        user.setRoles(roles);

        // 4. Save to DB
        userRepository.save(user);

        // 5. Generate Token immediately (so they don't have to login after register)
        String token = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                new HashSet<>() // Roles not needed for token generation in this simple example
        ));

        return new AuthResponse(token);
    }

//    public AuthResponse login(LoginRequest request) {
//        // 1. Authenticate using Spring Security Manager
//        // This will verify the username and password automatically
//        authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(
//                        request.getUsername(),
//                        request.getPassword()
//                )
//        );
//
//        // 2. If we get here, credentials are correct. Generate Token.
//        // We need to fetch the UserDetails again to get the Roles for the token
//        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();
//
//        // Convert to Spring UserDetails (minimal version for token)
//        // In a real app, you might refactor this conversion to a shared utility method
//        String token = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(
//                user.getUsername(),
//                user.getPassword(),
//                new HashSet<>()
//        ));
//
//        return new AuthResponse(token);
//    }
public AuthResponse login(LoginRequest request) {
    // 1. Authenticate
    authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
            )
    );

    // 2. Fetch User with Roles
    User user = userRepository.findByUsername(request.getUsername()).orElseThrow();

    // 3. Convert Custom Roles (Enum) to Spring Security Authorities
    // Create a Set of GrantedAuthority based on your Role enums
    Set<SimpleGrantedAuthority> authorities = user.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name())) // Ensure ROLE_ prefix
            .collect(Collectors.toSet());

    // 4. Generate Token WITH Roles
    String token = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            authorities // <--- PASS AUTHORITIES HERE, NOT new HashSet<>()
    ));

    return new AuthResponse(token);
}
}
