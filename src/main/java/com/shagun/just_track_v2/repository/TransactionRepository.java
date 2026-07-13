package com.shagun.just_track_v2.repository;

import com.shagun.just_track_v2.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
}
