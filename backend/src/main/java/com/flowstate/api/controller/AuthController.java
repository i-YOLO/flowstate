package com.flowstate.api.controller;

import com.flowstate.api.dto.JwtResponse;
import com.flowstate.api.dto.LoginRequest;
import com.flowstate.api.dto.RegisterRequest;
import com.flowstate.api.security.JwtProvider;
import com.flowstate.api.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtProvider jwtProvider;

    public AuthController(AuthenticationManager authenticationManager, UserService userService,
            JwtProvider jwtProvider) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtProvider = jwtProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtProvider.generateToken(loginRequest.getEmail());

        return ResponseEntity.ok(new JwtResponse(jwt, loginRequest.getEmail()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        userService.registerUser(registerRequest.getEmail(), registerRequest.getPassword(), registerRequest.getName());
        return ResponseEntity.ok("User registered successfully!");
    }
}
