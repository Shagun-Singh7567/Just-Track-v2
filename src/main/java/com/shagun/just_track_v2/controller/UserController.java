package com.shagun.just_track_v2.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.shagun.just_track_v2.model.User;
import com.shagun.just_track_v2.service.UserService;

    @RestController
@RequestMapping
public class UserController {
    final UserService service;

        public UserController(UserService service) {
            this.service = service;
        }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user)
    {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createUser(user));
    }
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id)
    {
        service.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
