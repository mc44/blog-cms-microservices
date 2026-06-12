package com.operations.blog.api;

import com.operations.blog.api.dto.CreatePostRequest;
import com.operations.blog.api.dto.PostResponse;
import com.operations.blog.api.dto.UpdatePostRequest;
import com.operations.blog.api.dto.UpdatePostStatusRequest;
import com.operations.blog.model.PostStatus;
import com.operations.blog.service.PostService;
import com.operations.blog.web.CorrelationIdFilter;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/blog/posts")
public class PostController {
  private final PostService postService;

  public PostController(PostService postService) {
    this.postService = postService;
  }

  @PostMapping
  public ResponseEntity<PostResponse> create(
      @Valid @RequestBody CreatePostRequest request,
      @RequestHeader(value = "X-Tenant-Id", required = false) String tenantId,
      @RequestHeader(value = "X-User-Id", required = false) String userId,
      @RequestHeader(value = CorrelationIdFilter.HEADER, required = false) String correlationId) {
    String authorId = userId != null ? userId : "anonymous";
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(postService.create(request, tenantId, authorId, correlationId));
  }

  @GetMapping("/{id}")
  public PostResponse get(
      @PathVariable String id,
      @RequestHeader(value = "X-Tenant-Id", required = false) String tenantId) {
    return postService.getById(id, tenantId);
  }

  @GetMapping
  public List<PostResponse> list(
      @RequestHeader(value = "X-Tenant-Id", required = false) String tenantId,
      @RequestParam(required = false) PostStatus status,
      @RequestParam(required = false) String authorId) {
    return postService.list(tenantId, status, authorId);
  }

  @PutMapping("/{id}")
  public PostResponse update(
      @PathVariable String id,
      @Valid @RequestBody UpdatePostRequest request,
      @RequestHeader(value = "X-Tenant-Id", required = false) String tenantId,
      @RequestHeader(value = "X-User-Id", required = false) String userId,
      @RequestHeader(value = CorrelationIdFilter.HEADER, required = false) String correlationId) {
    return postService.update(id, request, tenantId, userId, correlationId);
  }

  @PatchMapping("/{id}/status")
  public PostResponse updateStatus(
      @PathVariable String id,
      @RequestHeader(value = "X-Tenant-Id", required = false) String tenantId,
      @Valid @RequestBody UpdatePostStatusRequest request,
      @RequestHeader(value = "X-User-Id", required = false) String userId,
      @RequestHeader(value = CorrelationIdFilter.HEADER, required = false) String correlationId) {
    return postService.updateStatus(id, tenantId, request, userId, correlationId);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(
      @PathVariable String id,
      @RequestHeader(value = "X-Tenant-Id", required = false) String tenantId,
      @RequestHeader(value = "X-User-Id", required = false) String userId,
      @RequestHeader(value = CorrelationIdFilter.HEADER, required = false) String correlationId) {
    postService.delete(id, tenantId, userId, correlationId);
    return ResponseEntity.noContent().build();
  }
}
