package com.operations.blog.api.dto;

import com.operations.blog.model.PostStatus;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record CreatePostRequest(
    @NotBlank String title,
    @NotBlank String content,
    PostStatus status,
    List<String> categoryIds,
    List<String> tagIds,
    List<MediaRefDto> mediaRefs) {}
