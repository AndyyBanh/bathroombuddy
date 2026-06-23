package com.bathroombuddy.bathroombuddy.service;

import com.bathroombuddy.bathroombuddy.model.User;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    private static final String BASE64_SECRET =
            Base64.getEncoder().encodeToString("test-secret-key-which-is-long-enough-for-hs256-256-bits".getBytes());
    private static final long EXPIRATION_MS = 3_600_000L;

    private JwtService jwtService;
    private User user;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", BASE64_SECRET);
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", EXPIRATION_MS);

        user = new User("alice", "hashed-pw", "alice@example.com");
    }

    @Test
    void generateToken_thenExtractEmail_returnsUserEmail() {
        String token = jwtService.generateToken(user);

        assertThat(jwtService.extractEmail(token)).isEqualTo("alice@example.com");
    }

    @Test
    void generateToken_withClaims_preservesClaims() {
        String token = jwtService.generateToken(Map.of("role", "ADMIN"), user);

        String role = jwtService.extractClaim(token, claims -> claims.get("role", String.class));
        assertThat(role).isEqualTo("ADMIN");
    }

    @Test
    void isTokenValid_returnsTrue_forMatchingUserAndUnexpiredToken() {
        String token = jwtService.generateToken(user);

        assertThat(jwtService.isTokenValid(token, user)).isTrue();
    }

    @Test
    void isTokenValid_returnsFalse_forWrongUser() {
        String token = jwtService.generateToken(user);
        User other = new User("bob", "hashed-pw", "bob@example.com");

        assertThat(jwtService.isTokenValid(token, other)).isFalse();
    }

    @Test
    void isTokenValid_throwsExpiredJwtException_forExpiredToken() {
        String expiredToken = buildTokenWithExpiration(new Date(System.currentTimeMillis() - 1000));

        assertThatThrownBy(() -> jwtService.isTokenValid(expiredToken, user))
                .isInstanceOf(ExpiredJwtException.class);
    }

    @Test
    void getExpirationTime_returnsConfiguredValue() {
        assertThat(jwtService.getExpirationTime()).isEqualTo(EXPIRATION_MS);
    }

    private String buildTokenWithExpiration(Date expiration) {
        byte[] keyBytes = Decoders.BASE64.decode(BASE64_SECRET);
        Key key = Keys.hmacShaKeyFor(keyBytes);
        return Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis() - 10_000))
                .setExpiration(expiration)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}
