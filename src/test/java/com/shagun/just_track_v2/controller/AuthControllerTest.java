package com.shagun.just_track_v2.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shagun.just_track_v2.model.User;
import com.shagun.just_track_v2.repository.UserRepository;
import com.shagun.just_track_v2.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private AuthenticationManager authenticationManager;

    @InjectMocks private AuthController authController;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String EMAIL = "test@example.com";
    private static final String PASSWORD = "password123";
    private static final String NAME = "Test User";

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    private String json(Map<String, String> body) throws Exception {
        return objectMapper.writeValueAsString(body);
    }

    // ---------- SIGNUP ----------

    @Test
    void signup_success_returns201WithTokenAndSavesEncodedPassword() throws Exception {
        when(userRepository.findByEmailAddress(EMAIL)).thenReturn(Optional.empty());
        when(passwordEncoder.encode(PASSWORD)).thenReturn("hashed");
        when(jwtService.generateToken(EMAIL)).thenReturn("jwt-token");

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("email", EMAIL, "password", PASSWORD, "name", NAME))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.name").value(NAME));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User saved = captor.getValue();
        assertEquals(EMAIL, saved.getEmailAddress());
        assertEquals("hashed", saved.getPassword());   // never the raw password
        assertEquals(NAME, saved.getName());
    }

    @Test
    void signup_duplicateEmail_returns409AndDoesNotSave() throws Exception {
        when(userRepository.findByEmailAddress(EMAIL)).thenReturn(Optional.of(new User()));

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("email", EMAIL, "password", PASSWORD, "name", NAME))))
                .andExpect(status().isConflict());

        verify(userRepository, never()).save(any());
        verifyNoInteractions(jwtService, passwordEncoder);
    }

    @Test
    void signup_invalidBody_returns400() throws Exception {
        // Requires @NotBlank/@Email etc. on SignupRequest
        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("email", "", "password", "", "name", ""))))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(userRepository, jwtService);
    }

    @Test
    void signup_malformedJson_returns400() throws Exception {
        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{not json"))
                .andExpect(status().isBadRequest());
    }

    // ---------- LOGIN ----------

    @Test
    void login_success_returns200WithToken() throws Exception {
        User user = new User();
        user.setEmailAddress(EMAIL);
        user.setName(NAME);

        when(userRepository.findByEmailAddress(EMAIL)).thenReturn(Optional.of(user));
        when(jwtService.generateToken(EMAIL)).thenReturn("jwt-token");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("email", EMAIL, "password", PASSWORD))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.name").value(NAME));

        verify(authenticationManager).authenticate(
                new UsernamePasswordAuthenticationToken(EMAIL, PASSWORD));
    }

    @Test
    void login_badCredentials_returns401AndNoToken() throws Exception {
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("bad"));

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("email", EMAIL, "password", "wrong"))))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(jwtService);
        verify(userRepository, never()).findByEmailAddress(any());
    }

    @Test
    void login_authenticatedButUserMissing_returns401() throws Exception {
        when(userRepository.findByEmailAddress(EMAIL)).thenReturn(Optional.empty());

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("email", EMAIL, "password", PASSWORD))))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(jwtService);
    }

    @Test
    void login_invalidBody_returns400() throws Exception {
        // Requires validation annotations on LoginRequest
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("email", "", "password", ""))))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(authenticationManager);
    }
}