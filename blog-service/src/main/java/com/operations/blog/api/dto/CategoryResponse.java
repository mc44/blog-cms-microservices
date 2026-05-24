package com.operations.blog.api.dto;

import java.time.Instant;

public record CategoryResponse(String id, String name, String slug, Instant createdAt) {}
