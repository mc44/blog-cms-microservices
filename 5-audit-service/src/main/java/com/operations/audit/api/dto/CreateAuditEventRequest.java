package com.operations.audit.api.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Map;

public record CreateAuditEventRequest(
    String eventId,
    @NotBlank String tenantId,
    @NotBlank String eventType,
    String actorId,
    @NotBlank String resourceType,
    @NotBlank String resourceId,
    String correlationId,
    Map<String, Object> payload) {}
