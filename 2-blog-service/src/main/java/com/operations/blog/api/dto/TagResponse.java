package com.operations.blog.api.dto;

import java.time.Instant;

public record TagResponse(String id, String name, String slug, Instant createdAt) {}
