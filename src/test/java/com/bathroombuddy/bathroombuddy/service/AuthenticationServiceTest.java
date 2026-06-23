package com.bathroombuddy.bathroombuddy.service;

import com.bathroombuddy.bathroombuddy.dto.LoginUserDto;
import com.bathroombuddy.bathroombuddy.dto.RegisterUserDto;
import com.bathroombuddy.bathroombuddy.exceptions.UserAlreadyExistsException;
import com.bathroombuddy.bathroombuddy.exceptions.UserNotFoundException;
import com.bathroombuddy.bathroombuddy.model.User;
import com.bathroombuddy.bathroombuddy.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthenticationService authenticationService;

    @Test
    void signup_returnsSavedUser_whenEmailIsNew() {
        RegisterUserDto dto = registerDto("alice", "alice@example.com", "raw-pw");
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("raw-pw")).thenReturn("encoded-pw");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User result = authenticationService.signup(dto);

        ArgumentCaptor<User> saved = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(saved.capture());
        assertThat(saved.getValue().getUsername()).isEqualTo("alice");
        assertThat(saved.getValue().getEmail()).isEqualTo("alice@example.com");
        assertThat(saved.getValue().getPassword()).isEqualTo("encoded-pw");
        assertThat(result.getEmail()).isEqualTo("alice@example.com");
    }

    @Test
    void signup_throwsUserAlreadyExistsException_whenEmailExists() {
        RegisterUserDto dto = registerDto("alice", "alice@example.com", "raw-pw");
        when(userRepository.findByEmail("alice@example.com"))
                .thenReturn(Optional.of(new User("alice", "x", "alice@example.com")));

        assertThatThrownBy(() -> authenticationService.signup(dto))
                .isInstanceOf(UserAlreadyExistsException.class)
                .hasMessageContaining("already exists");

        verify(userRepository, never()).save(any());
    }

    @Test
    void authenticate_returnsUser_whenCredentialsValid() {
        LoginUserDto dto = loginDto("alice@example.com", "raw-pw");
        User stored = new User("alice", "encoded-pw", "alice@example.com");
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(stored));

        User result = authenticationService.authenticate(dto);

        ArgumentCaptor<UsernamePasswordAuthenticationToken> tokenCaptor =
                ArgumentCaptor.forClass(UsernamePasswordAuthenticationToken.class);
        verify(authenticationManager).authenticate(tokenCaptor.capture());
        assertThat(tokenCaptor.getValue().getPrincipal()).isEqualTo("alice@example.com");
        assertThat(tokenCaptor.getValue().getCredentials()).isEqualTo("raw-pw");
        assertThat(result).isSameAs(stored);
    }

    @Test
    void authenticate_throwsUserNotFoundException_whenEmailMissing() {
        LoginUserDto dto = loginDto("missing@example.com", "raw-pw");
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authenticationService.authenticate(dto))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("not found");

        verify(authenticationManager, never()).authenticate(any());
    }

    private static RegisterUserDto registerDto(String username, String email, String password) {
        RegisterUserDto dto = new RegisterUserDto();
        dto.setUsername(username);
        dto.setEmail(email);
        dto.setPassword(password);
        return dto;
    }

    private static LoginUserDto loginDto(String email, String password) {
        LoginUserDto dto = new LoginUserDto();
        dto.setEmail(email);
        dto.setPassword(password);
        return dto;
    }
}
