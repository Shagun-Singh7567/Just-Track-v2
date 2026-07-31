package com.shagun.just_track_v2.repository;

import com.shagun.just_track_v2.model.Transaction;
import com.shagun.just_track_v2.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser(User user);
    Optional<Transaction> findByIdAndUser(Long id, User user);
}