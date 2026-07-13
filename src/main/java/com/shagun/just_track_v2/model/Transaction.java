package com.shagun.just_track_v2.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Table(name = "transactions")
@Data
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate createdDate;
    private String description;
    private String category;
    @Enumerated(EnumType.STRING)
    private TransactionType type;
    private double amount;

}
    
