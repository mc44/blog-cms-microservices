package com.operations.blog.api.dto;

import jakarta.validation.constraints.NotBlank;

public record TagRequest(@NotBlank String name) {}
