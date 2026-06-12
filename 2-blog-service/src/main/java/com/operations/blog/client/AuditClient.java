package com.operations.blog.client;

import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class AuditClient {

  private static final Logger log = LoggerFactory.getLogger(AuditClient.class);

  private final RestClient restClient;
  private final boolean enabled;

  public AuditClient(
      @Value("${audit.service.base-url:http://audit-service:8084}") String baseUrl,
      @Value("${audit.enabled:true}") boolean enabled) {
    this.enabled = enabled;
    this.restClient = RestClient.builder().baseUrl(baseUrl).build();
  }

  public void record(
      String tenantId,
      String eventType,
      String actorId,
      String resourceId,
      String correlationId,
      Map<String, Object> payload) {
    if (!enabled) {
      return;
    }
    try {
      Map<String, Object> body = Map.of(
          "eventId", UUID.randomUUID().toString(),
          "tenantId", tenantId,
          "eventType", eventType,
          "actorId", actorId != null ? actorId : "system",
          "resourceType", "post",
          "resourceId", resourceId,
          "correlationId", correlationId != null ? correlationId : "",
          "payload", payload != null ? payload : Map.of());
      restClient
          .post()
          .uri("/audit/events")
          .contentType(MediaType.APPLICATION_JSON)
          .body(body)
          .retrieve()
          .toBodilessEntity();
    } catch (Exception ex) {
      log.warn("Audit append failed (non-blocking): {}", ex.getMessage());
    }
  }
}
