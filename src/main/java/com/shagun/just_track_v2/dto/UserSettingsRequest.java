package com.shagun.just_track_v2.dto;

// Both fields are optional (PATCH semantics) — whichever is null is left
// untouched on the existing settings row. Raw strings in, validated against
// the Theme/Currency enums in the service layer so we can return a clean
// 400 with the list of valid values instead of a generic Jackson parse error.
public record UserSettingsRequest(String theme, String currencyCode) {}
