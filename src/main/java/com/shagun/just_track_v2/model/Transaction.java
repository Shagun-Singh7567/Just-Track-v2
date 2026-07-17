package com.shagun.just_track_v2.model;

import java.time.LocalDate;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.*;
import lombok.Data;


@Entity
@Table(name = "railway")
@Data
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @CreationTimestamp
    @Column(name = "createddate")
    private LocalDate createdDate;
    private String description;
    private String category;
    @Enumerated(EnumType.STRING)
    private TransactionType type;
    private double amount;

}
    
