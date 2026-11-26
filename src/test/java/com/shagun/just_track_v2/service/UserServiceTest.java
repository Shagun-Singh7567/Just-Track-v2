package com.shagun.just_track_v2.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.shagun.just_track_v2.model.User;
import com.shagun.just_track_v2.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository repository;

    @InjectMocks
    private UserService userService;

    private User buildUser() {
        User user = new User();
        user.setId(1L);
        return user;
    }

    @Test
    @DisplayName("getUserById returns the user when found")
    void getUserById_whenUserExists_returnsUser() {
        User user = buildUser();
        when(repository.findById(1L)).thenReturn(Optional.of(user));

        User result = userService.getUserById(1L);

        assertSame(user, result);
        verify(repository).findById(1L);
    }

    @Test
    @DisplayName("getUserById throws when no user is found")
    void getUserById_whenUserNotFound_throwsException() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userService.getUserById(99L));

        assertEquals("User not found with id, 99", ex.getMessage());
        verify(repository).findById(99L);
    }

    @Test
    @DisplayName("deleteUser deletes the user when it exists")
    void deleteUser_whenUserExists_deletesUser() {
        User user = buildUser();
        when(repository.findById(1L)).thenReturn(Optional.of(user));

        userService.deleteUser(1L);

        verify(repository).findById(1L);
        verify(repository).delete(user);
    }

    @Test
    @DisplayName("deleteUser throws and does not delete when user is not found")
    void deleteUser_whenUserNotFound_throwsAndDoesNotDelete() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userService.deleteUser(99L));

        assertEquals("User not found with id, 99", ex.getMessage());
        verify(repository, never()).delete(any(User.class));
    }
}