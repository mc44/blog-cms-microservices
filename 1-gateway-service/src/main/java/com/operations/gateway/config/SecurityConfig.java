package com.operations.gateway.config;

import com.operations.gateway.security.JwtSecretKeySupport;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableReactiveMethodSecurity
public class SecurityConfig {

  @Bean
  SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
    return http
        .csrf(ServerHttpSecurity.CsrfSpec::disable)
        .authorizeExchange(exchanges -> exchanges
            .pathMatchers("/hello", "/actuator/**", "/auth/**").permitAll()
            .pathMatchers(HttpMethod.GET, "/blog/**", "/media/**").permitAll()
            .pathMatchers(HttpMethod.POST, "/media/upload").authenticated()
            .pathMatchers(HttpMethod.POST, "/blog/**").authenticated()
            .pathMatchers(HttpMethod.PUT, "/blog/**").authenticated()
            .pathMatchers(HttpMethod.PATCH, "/blog/**").authenticated()
            .pathMatchers(HttpMethod.DELETE, "/blog/**").authenticated()
            .pathMatchers(HttpMethod.GET, "/audit/**").authenticated()
            .pathMatchers(HttpMethod.GET, "/protected/**").authenticated()
            .anyExchange().permitAll())
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {}))
        .build();
  }

  @Bean
  ReactiveJwtDecoder reactiveJwtDecoder(@Value("${AUTH_JWT_SECRET:change-me-in-env-please-change-me-in-env}") String secret) {
    SecretKey secretKey = JwtSecretKeySupport.resolveSecretKey(secret);
    return NimbusReactiveJwtDecoder.withSecretKey(secretKey).build();
  }
}
