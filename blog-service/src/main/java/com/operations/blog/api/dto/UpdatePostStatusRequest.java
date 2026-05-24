package com.operations.blog.api.dto;

import com.operations.blog.model.PostStatus;
import jakarta.validation.constraints.NotNull;

public record UpdatePostStatusRequest(@NotNull PostStatus status) {}
