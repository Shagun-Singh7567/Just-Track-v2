package com.shagun.just_track_v2.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shagun.just_track_v2.model.Transaction;
import com.shagun.just_track_v2.model.User;
import com.shagun.just_track_v2.repository.TransactionRepository;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository repository;

    public List<Transaction> getAllTransactions(User user) {
        return repository.findByUser(user);
    }

    public Transaction getTransactionById(Long id, User user) {
        return repository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id, " + id));
    }

    public Transaction createTransaction(Transaction transaction, User user) {
        transaction.setUser(user);
        return repository.save(transaction);
    }

    public void deleteTransaction(Long id, User user) {
        Transaction transaction = getTransactionById(id, user);
        repository.delete(transaction);
    }
}