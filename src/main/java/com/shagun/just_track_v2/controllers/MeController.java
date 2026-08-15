package com.shagun.just_track_v2.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MeController {

    @GetMapping("/me")
    public String me(Authentication authentication) {
        return "Authenticated as: " + authentication.getName();
    }
    @GetMapping("/health")
    public ResponseEntity<String> health() {
    return ResponseEntity.ok("OK");
    }
}