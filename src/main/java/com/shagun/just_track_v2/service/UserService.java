package com.shagun.just_track_v2.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shagun.just_track_v2.model.User;
import com.shagun.just_track_v2.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository repository;

    public User createUser(User user)
    {
        return repository.save(user);
    }

    public User getUserById(Long id)
    {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("User not found with id, "+ id));
    }

    public void deleteUser(Long id)
    {
        User user = getUserById(id);
        repository.delete(user);
    }
}
