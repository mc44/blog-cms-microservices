package com.operations.blog.service;

import com.operations.blog.api.dto.CreatePostRequest;
import com.operations.blog.api.dto.MediaRefDto;
import com.operations.blog.api.dto.PostResponse;
import com.operations.blog.api.dto.UpdatePostRequest;
import com.operations.blog.api.dto.UpdatePostStatusRequest;
import com.operations.blog.client.AuditClient;
import com.operations.blog.client.MediaValidationClient;
import com.operations.blog.messaging.BlogEventPublisher;
import com.operations.blog.model.MediaRef;
import com.operations.blog.model.PostDocument;
import com.operations.blog.model.PostStatus;
import com.operations.blog.model.RevisionDocument;
import com.operations.blog.repository.PostRepository;
import com.operations.blog.repository.RevisionRepository;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PostService {
  private final String configuredTenantId;
  private final PostRepository postRepository;
  private final RevisionRepository revisionRepository;
  private final MediaValidationClient mediaValidationClient;
  private final AuditClient auditClient;
  private final BlogEventPublisher eventPublisher;

  public PostService(
      @Value("${blog.tenant-id}") String configuredTenantId,
      PostRepository postRepository,
      RevisionRepository revisionRepository,
      MediaValidationClient mediaValidationClient,
      AuditClient auditClient,
      BlogEventPublisher eventPublisher) {
    this.configuredTenantId = configuredTenantId;
    this.postRepository = postRepository;
    this.revisionRepository = revisionRepository;
    this.mediaValidationClient = mediaValidationClient;
    this.auditClient = auditClient;
    this.eventPublisher = eventPublisher;
  }

  public PostResponse create(
      CreatePostRequest request, String tenantId, String authorId, String correlationId) {
    String tenant = resolveTenant(tenantId);
    validateMediaRefs(request.mediaRefs());
    PostDocument post = new PostDocument();
    post.setTenantId(tenant);
    post.setTitle(request.title());
    post.setSlug(slugify(request.title()));
    post.setContent(request.content());
    post.setStatus(request.status() != null ? request.status() : PostStatus.DRAFT);
    post.setAuthorId(authorId);
    post.setCategoryIds(request.categoryIds());
    post.setTagIds(request.tagIds());
    post.setMediaRefs(toMediaRefs(request.mediaRefs()));
    Instant now = Instant.now();
    post.setCreatedAt(now);
    post.setUpdatedAt(now);
    if (post.getStatus() == PostStatus.PUBLISHED) {
      post.setPublishedAt(now);
    }
    PostResponse saved = toResponse(postRepository.save(post));
    if (post.getStatus() == PostStatus.PUBLISHED) {
      emitPostEvent("post.published", tenant, authorId, saved.id(), correlationId, saved);
    }
    return saved;
  }

  public PostResponse getById(String id, String tenantId, String userId) {
    String tenant = resolveTenant(tenantId);
    PostDocument post = postRepository.findByIdAndTenantId(id, tenant)
        .orElseThrow(() -> new BlogException("Post not found"));
    if (post.getStatus() == PostStatus.DRAFT && !isAuthor(post, userId)) {
      throw new BlogException("Post not found");
    }
    return toResponse(post);
  }

  public List<PostResponse> list(String tenantId, PostStatus status, String authorId) {
    String tenant = resolveTenant(tenantId);
    List<PostDocument> posts;
    if (authorId != null && !authorId.isBlank()) {
      posts = status != null
          ? postRepository.findByTenantIdAndAuthorIdAndStatusOrderByUpdatedAtDesc(tenant, authorId, status)
          : postRepository.findByTenantIdAndAuthorIdOrderByUpdatedAtDesc(tenant, authorId);
    } else {
      posts = status != null
          ? postRepository.findByTenantIdAndStatusOrderByUpdatedAtDesc(tenant, status)
          : postRepository.findByTenantIdOrderByUpdatedAtDesc(tenant);
    }
    return posts.stream().map(this::toResponse).toList();
  }

  @Transactional
  public PostResponse update(
      String id,
      UpdatePostRequest request,
      String tenantId,
      String authorId,
      String correlationId,
      boolean autosave) {
    String tenant = resolveTenant(tenantId);
    PostDocument post = postRepository.findByIdAndTenantId(id, tenant)
        .orElseThrow(() -> new BlogException("Post not found"));
    assertAuthor(post, authorId);
    if (!autosave) {
      snapshotRevision(post);
    }
    validateMediaRefs(request.mediaRefs());
    PostStatus previousStatus = post.getStatus();
    post.setTitle(request.title());
    post.setSlug(slugify(request.title()));
    post.setContent(request.content());
    if (request.status() != null) {
      post.setStatus(request.status());
    }
    if (request.categoryIds() != null) {
      post.setCategoryIds(request.categoryIds());
    }
    if (request.tagIds() != null) {
      post.setTagIds(request.tagIds());
    }
    if (request.mediaRefs() != null) {
      post.setMediaRefs(toMediaRefs(request.mediaRefs()));
    }
    post.setUpdatedAt(Instant.now());
    if (post.getStatus() == PostStatus.PUBLISHED && post.getPublishedAt() == null) {
      post.setPublishedAt(Instant.now());
    }
    PostResponse saved = toResponse(postRepository.save(post));
    if (!autosave) {
      emitPostEvent("post.updated", tenant, authorId, saved.id(), correlationId, saved);
      if (previousStatus != PostStatus.PUBLISHED && post.getStatus() == PostStatus.PUBLISHED) {
        emitPostEvent("post.published", tenant, authorId, saved.id(), correlationId, saved);
      }
    }
    return saved;
  }

  @Transactional
  public PostResponse updateStatus(
      String id, String tenantId, UpdatePostStatusRequest request, String authorId, String correlationId) {
    String tenant = resolveTenant(tenantId);
    PostDocument post = postRepository.findByIdAndTenantId(id, tenant)
        .orElseThrow(() -> new BlogException("Post not found"));
    assertAuthor(post, authorId);
    snapshotRevision(post);
    PostStatus previousStatus = post.getStatus();
    post.setStatus(request.status());
    post.setUpdatedAt(Instant.now());
    if (request.status() == PostStatus.PUBLISHED && post.getPublishedAt() == null) {
      post.setPublishedAt(Instant.now());
    }
    PostResponse saved = toResponse(postRepository.save(post));
    if (previousStatus != PostStatus.PUBLISHED && request.status() == PostStatus.PUBLISHED) {
      emitPostEvent("post.published", tenant, authorId, saved.id(), correlationId, saved);
    } else {
      emitPostEvent("post.updated", tenant, authorId, saved.id(), correlationId, saved);
    }
    return saved;
  }

  @Transactional
  public void delete(String id, String tenantId, String authorId, String correlationId) {
    String tenant = resolveTenant(tenantId);
    PostDocument post = postRepository.findByIdAndTenantId(id, tenant)
        .orElseThrow(() -> new BlogException("Post not found"));
    assertAuthor(post, authorId);
    postRepository.delete(post);
    emitPostEvent("post.deleted", tenant, authorId, id, correlationId, Map.of("title", post.getTitle()));
  }

  private void emitPostEvent(
      String eventType,
      String tenantId,
      String actorId,
      String postId,
      String correlationId,
      Object payloadSource) {
    Map<String, Object> payload;
    if (payloadSource instanceof PostResponse post) {
      payload = Map.of("title", post.title(), "status", post.status().name(), "slug", post.slug());
    } else if (payloadSource instanceof Map<?, ?> map) {
      payload = Map.of("title", String.valueOf(map.get("title")));
    } else {
      payload = Map.of();
    }
    auditClient.record(tenantId, eventType, actorId, postId, correlationId, payload);
    eventPublisher.publish(tenantId, eventType, actorId, postId, correlationId, payload);
  }

  private String resolveTenant(String headerTenantId) {
    if (headerTenantId != null && !headerTenantId.isBlank()) {
      if (!headerTenantId.equals(configuredTenantId)) {
        throw new BlogException("Tenant mismatch");
      }
      return headerTenantId;
    }
    return configuredTenantId;
  }

  private void assertAuthor(PostDocument post, String userId) {
    if (userId == null || userId.isBlank() || !userId.equals(post.getAuthorId())) {
      throw new BlogException("Post not found");
    }
  }

  private boolean isAuthor(PostDocument post, String userId) {
    return userId != null && !userId.isBlank() && userId.equals(post.getAuthorId());
  }

  private void snapshotRevision(PostDocument post) {
    int next = revisionRepository.countByPostId(post.getId()) + 1;
    RevisionDocument revision = new RevisionDocument();
    revision.setPostId(post.getId());
    revision.setTitle(post.getTitle());
    revision.setContent(post.getContent());
    revision.setRevisionNumber(next);
    revision.setCreatedAt(Instant.now());
    revisionRepository.save(revision);
  }

  private void validateMediaRefs(List<MediaRefDto> refs) {
    if (refs == null) {
      return;
    }
    for (MediaRefDto ref : refs) {
      if (ref.cloudinaryPublicId() == null || ref.cloudinaryPublicId().isBlank()) {
        throw new BlogException("Media reference requires cloudinaryPublicId");
      }
      if (!mediaValidationClient.exists(ref.cloudinaryPublicId())) {
        throw new BlogException("Unknown media asset: " + ref.cloudinaryPublicId());
      }
    }
  }

  private List<MediaRef> toMediaRefs(List<MediaRefDto> dtos) {
    if (dtos == null) {
      return List.of();
    }
    return dtos.stream().map(dto -> {
      MediaRef ref = new MediaRef();
      ref.setCloudinaryPublicId(dto.cloudinaryPublicId());
      ref.setSecureUrl(dto.secureUrl());
      return ref;
    }).collect(Collectors.toList());
  }

  private String slugify(String title) {
    String base = title.toLowerCase(Locale.ROOT)
        .replaceAll("[^a-z0-9]+", "-")
        .replaceAll("^-|-$", "");
    return base.isBlank() ? "post-" + System.currentTimeMillis() : base;
  }

  private PostResponse toResponse(PostDocument post) {
    List<MediaRefDto> media = post.getMediaRefs().stream()
        .map(m -> new MediaRefDto(m.getCloudinaryPublicId(), m.getSecureUrl()))
        .toList();
    return new PostResponse(
        post.getId(),
        post.getTitle(),
        post.getSlug(),
        post.getContent(),
        post.getStatus(),
        post.getAuthorId(),
        post.getCategoryIds(),
        post.getTagIds(),
        media,
        post.getCreatedAt(),
        post.getUpdatedAt(),
        post.getPublishedAt());
  }
}
