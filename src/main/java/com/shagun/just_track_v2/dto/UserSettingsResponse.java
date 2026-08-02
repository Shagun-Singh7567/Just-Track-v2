package com.shagun.just_track_v2.dto;

// Deliberately doesn't expose the UserSettings entity (or the nested User)
// directly over the wire — same reasoning as AuthResponse.
public record UserSettingsResponse(String theme, String currencyCode) {}
