package com.operations.audit.kafka;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.operations.audit.api.dto.CreateAuditEventRequest;
import com.operations.audit.service.AuditEventService;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "kafka.enabled", havingValue = "true")
public class BlogDomainEventConsumer {

  private static final Logger log = LoggerFactory.getLogger(BlogDomainEventConsumer.class);

  private final AuditEventService auditEventService;
  private final ObjectMapper objectMapper;

  public BlogDomainEventConsumer(AuditEventService auditEventService, ObjectMapper objectMapper) {
    this.auditEventService = auditEventService;
    this.objectMapper = objectMapper;
  }

  @KafkaListener(topics = "${kafka.topic}", groupId = "audit-service")
  public void onMessage(String payload) {
    try {
      JsonNode node = objectMapper.readTree(payload);
      String eventId = text(node, "eventId");
      String tenantId = text(node, "tenantId");
      String eventType = text(node, "eventType");
      String actorId = text(node, "actorId");
      String resourceId = text(node, "resourceId");
      String correlationId = text(node, "correlationId");
      if (eventType == null || tenantId == null || resourceId == null) {
        log.warn("Skipping Kafka message with missing fields: {}", payload);
        return;
      }
      auditEventService.append(new CreateAuditEventRequest(
          eventId,
          tenantId,
          eventType,
          actorId,
          "post",
          resourceId,
          correlationId,
          objectMapper.convertValue(node, Map.class)));
    } catch (Exception ex) {
      log.error("Failed to process Kafka audit event: {}", ex.getMessage());
    }
  }

  private static String text(JsonNode node, String field) {
    JsonNode value = node.get(field);
    return value != null && !value.isNull() ? value.asText() : null;
  }
}
