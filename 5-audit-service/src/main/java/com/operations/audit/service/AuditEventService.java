package com.operations.audit.service;

import com.operations.audit.api.dto.AuditEventResponse;
import com.operations.audit.api.dto.CreateAuditEventRequest;
import com.operations.audit.model.AuditEventDocument;
import com.operations.audit.repository.AuditEventRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AuditEventService {

  private final String defaultTenantId;
  private final AuditEventRepository repository;

  public AuditEventService(
      @Value("${audit.default-tenant-id}") String defaultTenantId,
      AuditEventRepository repository) {
    this.defaultTenantId = defaultTenantId;
    this.repository = repository;
  }

  public AuditEventResponse append(CreateAuditEventRequest request) {
    String eventId = request.eventId() != null && !request.eventId().isBlank()
        ? request.eventId()
        : UUID.randomUUID().toString();
    if (repository.findByEventId(eventId).isPresent()) {
      return repository.findByEventId(eventId).map(this::toResponse).orElseThrow();
    }
    AuditEventDocument doc = new AuditEventDocument();
    doc.setEventId(eventId);
    doc.setTenantId(resolveTenant(request.tenantId()));
    doc.setEventType(request.eventType());
    doc.setActorId(request.actorId());
    doc.setResourceType(request.resourceType());
    doc.setResourceId(request.resourceId());
    doc.setCorrelationId(request.correlationId());
    doc.setPayload(request.payload());
    doc.setOccurredAt(Instant.now());
    return toResponse(repository.save(doc));
  }

  public List<AuditEventResponse> list(String tenantId, int limit) {
    String tenant = resolveTenant(tenantId);
    int capped = Math.min(Math.max(limit, 1), 200);
    return repository.findByTenantIdOrderByOccurredAtDesc(tenant).stream()
        .limit(capped)
        .map(this::toResponse)
        .toList();
  }

  private String resolveTenant(String tenantId) {
    if (tenantId != null && !tenantId.isBlank()) {
      return tenantId;
    }
    return defaultTenantId;
  }

  private AuditEventResponse toResponse(AuditEventDocument doc) {
    return new AuditEventResponse(
        doc.getId(),
        doc.getEventId(),
        doc.getTenantId(),
        doc.getEventType(),
        doc.getActorId(),
        doc.getResourceType(),
        doc.getResourceId(),
        doc.getCorrelationId(),
        doc.getPayload(),
        doc.getOccurredAt());
  }
}
