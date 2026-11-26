package com.shagun.just_track_v2.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Date;

import javax.crypto.SecretKey;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

class JwtServiceTest {

    private static final String SECRET = "test-secret-key-that-is-at-least-32-bytes-long!!";
    private static final String EMAIL = "test@example.com";

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", SECRET);
        ReflectionTestUtils.setField(jwtService, "expirationMs", 60_000L);
    }

    @Test
    @DisplayName("generateToken returns a well-formed JWT")
    void generateToken_returnsThreePartToken() {
        String token = jwtService.generateToken(EMAIL);

        assertNotNull(token);
        assertEquals(3, token.split("\\.").length);
    }

    @Test
    @DisplayName("extractEmail returns the subject the token was generated with")
    void extractEmail_returnsOriginalEmail() {
        String token = jwtService.generateToken(EMAIL);

        assertEquals(EMAIL, jwtService.extractEmail(token));
    }

    @Test
    @DisplayName("isTokenValid returns true for matching email and unexpired token")
    void isTokenValid_whenEmailMatchesAndNotExpired_returnsTrue() {
        String token = jwtService.generateToken(EMAIL);

        assertTrue(jwtService.isTokenValid(token, EMAIL));
    }

    @Test
    @DisplayName("isTokenValid returns false when email does not match")
    void isTokenValid_whenEmailDiffers_returnsFalse() {
        String token = jwtService.generateToken(EMAIL);

        assertFalse(jwtService.isTokenValid(token, "other@example.com"));
    }

    @Test
    @DisplayName("expired token throws ExpiredJwtException")
    void isTokenValid_whenTokenExpired_throwsExpiredJwtException() {
        ReflectionTestUtils.setField(jwtService, "expirationMs", -1000L);
        String token = jwtService.generateToken(EMAIL);

        assertThrows(ExpiredJwtException.class, () -> jwtService.isTokenValid(token, EMAIL));
    }

    @Test
    @DisplayName("token signed with a different key is rejected")
    void extractEmail_whenSignedWithDifferentKey_throwsJwtException() {
        SecretKey otherKey = Keys.hmacShaKeyFor(
                "a-completely-different-secret-key-32-bytes!!".getBytes());
        String forged = Jwts.builder()
                .subject(EMAIL)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 60_000))
                .signWith(otherKey)
                .compact();

        assertThrows(JwtException.class, () -> jwtService.extractEmail(forged));
    }

    @Test
    @DisplayName("malformed token is rejected")
    void extractEmail_whenTokenMalformed_throwsJwtException() {
        assertThrows(JwtException.class, () -> jwtService.extractEmail("not.a.jwt"));
    }
}