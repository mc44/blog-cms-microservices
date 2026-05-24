package com.operations.blog.api.dto;

import com.operations.blog.model.PostStatus;
import java.time.Instant;
import java.util.List;

public record PostResponse(
    String id,
    String title,
    String slug,
    String content,
    PostStatus status,
    String authorId,
    List<String> categoryIds,
    List<String> tagIds,
    List<MediaRefDto> mediaRefs,
    Instant createdAt,
    Instant updatedAt,
    Instant publishedAt) {}
