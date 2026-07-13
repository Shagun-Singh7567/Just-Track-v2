package com.shagun.just_track_v2.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shagun.just_track_v2.model.Transaction;
import com.shagun.just_track_v2.repository.TransactionRepository;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository repository;

    public List<Transaction> getAllTransactions()
    {
        return repository.findAll();
    }
    public Transaction createTransaction(Transaction transaction)
    {
        return repository.save(transaction);
    }
    
}
