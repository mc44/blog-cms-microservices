package com.operations.blog.api.dto;

import jakarta.validation.constraints.NotBlank;

public record MediaRefDto(
    @NotBlank String cloudinaryPublicId,
    String secureUrl) {}
