package com.shagun.just_track_v2.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shagun.just_track_v2.model.User;
import com.shagun.just_track_v2.service.UserService;

    @RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "https://just-track-v2.vercel.app"})
public class UserController {
    @Autowired
    UserService service;

    @PostMapping("/transactions")
    public ResponseEntity<User> createUser(@RequestBody User user)
    {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createUser(user));
    }
    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id)
    {
        service.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
