package com.operations.gateway.web;

import java.util.Map;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
public class ProtectedController {

  @GetMapping("/protected/example")
  public Mono<Map<String, String>> protectedExample(@AuthenticationPrincipal Jwt jwt) {
    String userId = jwt == null ? "unknown" : jwt.getSubject();
    return Mono.just(Map.of("service", "gateway-service", "userId", userId, "status", "authorized"));
  }
}
