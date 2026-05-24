package com.operations.audit.repository;

import com.operations.audit.model.AuditEventDocument;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AuditEventRepository extends MongoRepository<AuditEventDocument, String> {

  Optional<AuditEventDocument> findByEventId(String eventId);

  List<AuditEventDocument> findByTenantIdOrderByOccurredAtDesc(String tenantId);
}
