package com.shagun.just_track_v2.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shagun.just_track_v2.model.UserSettings;
import com.shagun.just_track_v2.repository.UserSettingsRepository;

@Service
public class UserSettingsService {
    @Autowired
    private UserSettingsRepository repository;

    public UserSettings createUserSettings(UserSettings user)
    {
        return repository.save(user);
    }

    public UserSettings getUserSettingsById(Long id)
    {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("User Settings not found with id, "+ id));
    }
    // I know, this is pretty much the same as the createUserSettings method, but it seems clearer for when we're abstracting ts to the controller
    public UserSettings updateUserSettings(UserSettings user)
    {
        return repository.save(user);
    }

}
