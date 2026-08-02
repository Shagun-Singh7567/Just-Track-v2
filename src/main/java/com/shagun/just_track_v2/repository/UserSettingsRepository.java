package com.shagun.just_track_v2.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shagun.just_track_v2.model.User;
import com.shagun.just_track_v2.model.UserSettings;

public interface UserSettingsRepository extends JpaRepository<UserSettings, Long>{

    Optional<UserSettings> findByUser(User user);
}
