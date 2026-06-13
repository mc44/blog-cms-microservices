package com.operations.gateway.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

/**
 * Matches auth-service {@code TokenService.resolveSecretKey}: SHA-256 of the raw secret
 * becomes the HS256 key material.
 */
public final class JwtSecretKeySupport {

  private JwtSecretKeySupport() {}

  public static SecretKey resolveSecretKey(String rawSecret) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] keyMaterial = digest.digest(rawSecret.getBytes(StandardCharsets.UTF_8));
      return new SecretKeySpec(keyMaterial, "HmacSHA256");
    } catch (NoSuchAlgorithmException ex) {
      throw new IllegalStateException("Unable to create JWT signing key", ex);
    }
  }
}
