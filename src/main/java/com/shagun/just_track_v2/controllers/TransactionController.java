package com.shagun.just_track_v2.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.shagun.just_track_v2.model.Transaction;
import com.shagun.just_track_v2.model.User;
import com.shagun.just_track_v2.repository.UserRepository;
import com.shagun.just_track_v2.service.TransactionService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "https://just-track-v2.vercel.app"})
public class TransactionController {
    @Autowired
    TransactionService service;

    @Autowired
    UserRepository userRepository;

    private User resolveUser(UserDetails userDetails) {
        return userRepository.findByEmailAddress(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    @GetMapping("/transactions")
    public List<Transaction> getMethodName(@AuthenticationPrincipal UserDetails userDetails) {
        return service.getAllTransactions(resolveUser(userDetails));
    }

    @PostMapping("/transactions")
    public ResponseEntity<Transaction> createTransaction(
            @RequestBody Transaction transaction,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createTransaction(transaction, resolveUser(userDetails)));
    }

    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        service.deleteTransaction(id, resolveUser(userDetails));
        return ResponseEntity.noContent().build();
    }
}