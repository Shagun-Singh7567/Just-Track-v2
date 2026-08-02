package com.shagun.just_track_v2.service;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.shagun.just_track_v2.dto.UserSettingsRequest;
import com.shagun.just_track_v2.model.Currency;
import com.shagun.just_track_v2.model.Theme;
import com.shagun.just_track_v2.model.User;
import com.shagun.just_track_v2.model.UserSettings;
import com.shagun.just_track_v2.repository.UserSettingsRepository;

@Service
public class UserSettingsService {
    @Autowired
    private UserSettingsRepository repository;

    private static final Theme DEFAULT_THEME = Theme.LIGHT;
    private static final Currency DEFAULT_CURRENCY = Currency.USD;

    // Settings rows are created lazily on first access rather than requiring
    // a separate "create" call the frontend has to remember to make right
    // after signup.
    public UserSettings getOrCreateUserSettings(User user) {
        return repository.findByUser(user).orElseGet(() -> createDefaultSettings(user));
    }

    private UserSettings createDefaultSettings(User user) {
        UserSettings settings = new UserSettings();
        settings.setUser(user);
        settings.setTheme(DEFAULT_THEME);
        settings.setCurrency(DEFAULT_CURRENCY);
        return repository.save(settings);
    }

    // Partial update: a null field in the request leaves the existing value
    // alone, so the frontend can PATCH just { theme } or just { currencyCode }
    // without having to resend the whole settings object.
    public UserSettings updateUserSettings(User user, UserSettingsRequest request) {
        UserSettings settings = getOrCreateUserSettings(user);

        if (request.theme() != null) {
            settings.setTheme(parseTheme(request.theme()));
        }
        if (request.currencyCode() != null) {
            settings.setCurrency(parseCurrency(request.currencyCode()));
        }

        return repository.save(settings);
    }

    private Theme parseTheme(String raw) {
        try {
            return Theme.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid theme '" + raw + "'. Must be one of: " + Arrays.toString(Theme.values())
            );
        }
    }

    // ISO 4217 validation: the Currency enum is already the full ISO 4217
    // alphabetic code list, so validity is just "is this a member of the enum".
    private Currency parseCurrency(String raw) {
        try {
            return Currency.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid currency code '" + raw + "'. Must be a valid ISO 4217 currency code."
            );
        }
    }
}
