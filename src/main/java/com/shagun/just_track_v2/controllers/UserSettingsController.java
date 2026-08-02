package com.shagun.just_track_v2.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.shagun.just_track_v2.dto.UserSettingsRequest;
import com.shagun.just_track_v2.dto.UserSettingsResponse;
import com.shagun.just_track_v2.model.User;
import com.shagun.just_track_v2.model.UserSettings;
import com.shagun.just_track_v2.repository.UserRepository;
import com.shagun.just_track_v2.service.UserSettingsService;

@RestController
@RequestMapping("/settings")
@CrossOrigin(origins = {"http://localhost:5173", "https://just-track-v2.vercel.app"})
public class UserSettingsController {
    @Autowired
    UserSettingsService service;

    @Autowired
    UserRepository userRepository;

    private User resolveUser(UserDetails userDetails) {
        return userRepository.findByEmailAddress(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    // GET instead of the old POST-to-create: settings are created lazily
    // with sensible defaults the first time a user's settings are read, so
    // the frontend never has to worry about "have I created this yet?".
    @GetMapping
    public ResponseEntity<UserSettingsResponse> getUserSettings(@AuthenticationPrincipal UserDetails userDetails) {
        UserSettings settings = service.getOrCreateUserSettings(resolveUser(userDetails));
        return ResponseEntity.ok(toResponse(settings));
    }

    @PatchMapping
    public ResponseEntity<UserSettingsResponse> updateUserSettings(
            @RequestBody UserSettingsRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        UserSettings settings = service.updateUserSettings(resolveUser(userDetails), request);
        return ResponseEntity.ok(toResponse(settings));
    }

    private UserSettingsResponse toResponse(UserSettings settings) {
        return new UserSettingsResponse(settings.getTheme().name(), settings.getCurrency().name());
    }
}
