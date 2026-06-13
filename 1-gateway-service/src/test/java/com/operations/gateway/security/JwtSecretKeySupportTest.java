package com.operations.gateway.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import io.jsonwebtoken.Jwts;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;

class JwtSecretKeySupportTest {
  private static final String SECRET = "change-me-in-env-please-change-me-in-env";

  @Test
  void decoderAcceptsTokenSignedWithAuthCompatibleKey() {
    SecretKey secretKey = JwtSecretKeySupport.resolveSecretKey(SECRET);
    String token =
        Jwts.builder()
            .issuer("auth-service")
            .subject("user-123")
            .issuedAt(Date.from(Instant.now()))
            .expiration(Date.from(Instant.now().plusSeconds(900)))
            .claim("tenantId", "blog-cms")
            .signWith(secretKey)
            .compact();

    ReactiveJwtDecoder decoder = NimbusReactiveJwtDecoder.withSecretKey(secretKey).build();
    var jwt = decoder.decode(token).block();

    assertNotNull(jwt);
    assertEquals("user-123", jwt.getSubject());
    assertEquals("blog-cms", jwt.getClaimAsString("tenantId"));
  }
}
