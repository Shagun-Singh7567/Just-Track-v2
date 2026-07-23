package com.shagun.just_track_v2.model;

import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;
    @CreationTimestamp
    @Column(name = "created_date")
    private LocalDate createdDate;
    private String name;
    @Column(name = "email_address")
    private String emailAddress;
    private String password;
}
