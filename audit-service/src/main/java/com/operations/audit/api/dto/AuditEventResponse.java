package com.operations.audit.api.dto;

import java.time.Instant;
import java.util.Map;

public record AuditEventResponse(
    String id,
    String eventId,
    String tenantId,
    String eventType,
    String actorId,
    String resourceType,
    String resourceId,
    String correlationId,
    Map<String, Object> payload,
    Instant occurredAt) {}
