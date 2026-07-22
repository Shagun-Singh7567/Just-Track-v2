package com.shagun.just_track_v2.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_settings")
@Data
public class UserSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Theme theme;
    @Column(name = "currency_code", nullable = false, length = 3)
    private Currency currency;
}
