package com.shagun.just_track_v2.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shagun.just_track_v2.model.UserSettings;
import com.shagun.just_track_v2.service.UserSettingsService;

    @RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "https://just-track-v2.vercel.app"})
public class UserSettingsController {
    @Autowired
    UserSettingsService service;

    @PostMapping("/settings/")
    public ResponseEntity<UserSettings> createUserSettings(@RequestBody UserSettings user)
    {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createUserSettings(user));
    }
    @PatchMapping("/settings/")
    public ResponseEntity<UserSettings> updateUserSettings(@RequestBody UserSettings user)
    {
        return ResponseEntity.status(HttpStatus.OK).body(service.updateUserSettings(user));
    }

}
