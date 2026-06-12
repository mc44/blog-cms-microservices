package com.operations.blog.messaging;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class BlogEventPublisher {

  private static final Logger log = LoggerFactory.getLogger(BlogEventPublisher.class);

  private final KafkaTemplate<String, String> kafkaTemplate;
  private final ObjectMapper objectMapper;
  private final boolean enabled;
  private final String topic;

  public BlogEventPublisher(
      KafkaTemplate<String, String> kafkaTemplate,
      ObjectMapper objectMapper,
      @Value("${kafka.enabled:false}") boolean enabled,
      @Value("${kafka.topic:blog.domain.events}") String topic) {
    this.kafkaTemplate = kafkaTemplate;
    this.objectMapper = objectMapper;
    this.enabled = enabled;
    this.topic = topic;
  }

  public void publish(
      String tenantId,
      String eventType,
      String actorId,
      String resourceId,
      String correlationId,
      Map<String, Object> extra) {
    if (!enabled) {
      return;
    }
    Map<String, Object> event = new HashMap<>();
    event.put("eventId", UUID.randomUUID().toString());
    event.put("tenantId", tenantId);
    event.put("eventType", eventType);
    event.put("actorId", actorId);
    event.put("resourceId", resourceId);
    event.put("correlationId", correlationId);
    if (extra != null) {
      event.putAll(extra);
    }
    try {
      String json = objectMapper.writeValueAsString(event);
      kafkaTemplate.send(topic, tenantId, json);
    } catch (JsonProcessingException ex) {
      log.warn("Failed to serialize blog event: {}", ex.getMessage());
    }
  }
}
