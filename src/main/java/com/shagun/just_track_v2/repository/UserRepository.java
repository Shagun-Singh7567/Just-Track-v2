package com.shagun.just_track_v2.repository;

import com.shagun.just_track_v2.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long>{
    
}
