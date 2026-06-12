package com.operations.audit.api;

import com.operations.audit.api.dto.AuditEventResponse;
import com.operations.audit.api.dto.CreateAuditEventRequest;
import com.operations.audit.service.AuditEventService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/audit")
public class AuditController {

  private final AuditEventService auditEventService;

  public AuditController(AuditEventService auditEventService) {
    this.auditEventService = auditEventService;
  }

  @PostMapping("/events")
  public ResponseEntity<AuditEventResponse> append(@Valid @RequestBody CreateAuditEventRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(auditEventService.append(request));
  }

  @GetMapping("/events")
  public List<AuditEventResponse> list(
      @RequestHeader(value = "X-Tenant-Id", required = false) String tenantId,
      @RequestParam(defaultValue = "50") int limit) {
    return auditEventService.list(tenantId, limit);
  }
}
