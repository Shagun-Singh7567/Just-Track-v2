package com.shagun.just_track_v2.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.shagun.just_track_v2.model.Transaction;
import com.shagun.just_track_v2.service.TransactionService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {
    @Autowired
    TransactionService service;

    @GetMapping("/transactions")
    public List<Transaction> getMethodName() {
        return service.getAllTransactions();
    }

    @PostMapping("/transactions")
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction)
    {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createTransaction(transaction));
    }
    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id)
    {
        service.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }
    {

    }
    
}
